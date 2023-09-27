use anchor_lang::prelude::*;

use crate::globals::constants::LEADERBOARD_SEED;
use crate::pdas::leaderboard_account::Leaderboard;
use crate::pdas::leaderboard_account::LeaderboardEntry;

#[derive(Accounts)]
pub struct InitializeLeaderboard<'info> {
    #[account(
        init,
        payer = fee_payer,
        space = std::mem::size_of::<Leaderboard>() + 8,
        seeds = [LEADERBOARD_SEED],
        bump
    )]
    leaderboard: Account<'info, Leaderboard>,

    #[account(mut)]
    fee_payer: Signer<'info>,

    system_program: Program<'info, System>,
}

pub fn run_initialize_leaderboard(ctx: Context<InitializeLeaderboard>) -> Result<()> {
    // Create the leaderboard account
    {
        let leader_board_account = &mut ctx.accounts.leaderboard;

        leader_board_account.leaderboard = [LeaderboardEntry {
            wallet: Pubkey::default(),
            points: 0,
        }; 5];
    }
    Ok(())
}
