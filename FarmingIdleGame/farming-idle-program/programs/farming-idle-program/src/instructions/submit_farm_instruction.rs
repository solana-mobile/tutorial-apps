use anchor_lang::prelude::*;

use crate::globals::constants::LEADERBOARD_SEED;
use crate::pdas::farm_account::Farm;
use crate::pdas::leaderboard_account::Leaderboard;
use crate::pdas::leaderboard_account::LeaderboardEntry;

#[derive(Accounts)]
pub struct SubmitFarm<'info> {
    #[account(
        mut,
        has_one = owner,
        has_one = player
    )]
    farm: Account<'info, Farm>,

    #[account(
        mut,
        seeds = [LEADERBOARD_SEED],
        bump
    )]
    leaderboard: Account<'info, Leaderboard>,

    #[account(mut)]
    owner: Signer<'info>,
    #[account(mut)]
    player: Signer<'info>,

    system_program: Program<'info, System>,
}

pub fn run_submit_farm(ctx: Context<SubmitFarm>) -> Result<()> {
    // If farm is initialized:
    //   Update farm highscore if applicable
    //   Update the leaderboard if applicable
    //   Reset the farm
    {
        let farm = &mut ctx.accounts.farm;
        if farm.initialized {
            let amount_to_submit = farm.harvest_points;

            // Update the highscore
            if amount_to_submit > farm.high_score {
                farm.high_score = amount_to_submit;
            }

            // Determine whether submission fits in the leaderboard
            let mut lowest_points_index = 0;
            let mut lowest_points_value = u64::MAX;
            for (i, entry) in ctx.accounts.leaderboard.leaderboard.iter().enumerate() {
                if entry.points < lowest_points_value {
                    lowest_points_value = entry.points;
                    lowest_points_index = i;
                }
            }

            // Update leaderboard if needed
            if amount_to_submit > lowest_points_value {
                ctx.accounts.leaderboard.leaderboard[lowest_points_index] = LeaderboardEntry {
                    wallet: ctx.accounts.owner.key().clone(),
                    points: amount_to_submit,
                }
            }

            // Reset the farm points and upgrades
            farm.last_harvested = Clock::get()?.unix_timestamp;
            farm.farm_upgrades = [0; 16];
        }
    }

    Ok(())
}
