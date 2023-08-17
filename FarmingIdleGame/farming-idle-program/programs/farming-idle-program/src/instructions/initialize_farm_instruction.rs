use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};

use crate::pdas::farm_account::Farm;

#[derive(Accounts)]
pub struct InitializeFarm<'info> {
    #[account(
        init,
        payer = owner,
        space = std::mem::size_of::<Farm>() + 8,
        seeds = [b"farm", player.key().as_ref(), owner.key().as_ref()],
        bump
    )]
    farm: Account<'info, Farm>,

    #[account(mut)]
    owner: Signer<'info>,
    #[account(mut)]
    player: Signer<'info>,

    system_program: Program<'info, System>,
}

pub fn run_initialize_farm(ctx: Context<InitializeFarm>, bump: u8) -> Result<()> {
    // Transfer initial deposit to burner 'player' wallet
    let transfer_amount: u64 = 10_000_000_u64;
    if ctx.accounts.player.lamports() < transfer_amount {
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            Transfer {
                from: ctx.accounts.owner.to_account_info(),
                to: ctx.accounts.player.to_account_info(),
            },
        );
        transfer(cpi_context, transfer_amount)?;
    }

    // Create the farm account
    {
        let farm = &mut ctx.accounts.farm;

        farm.initialized = true;
        farm.owner = ctx.accounts.owner.key().clone();
        farm.player = ctx.accounts.player.key().clone();
        farm.bump = bump;
        farm.date_created = Clock::get()?.unix_timestamp;
        farm.last_harvested = Clock::get()?.unix_timestamp;
        farm.harvest_points = 0;
    }
    Ok(())
}
