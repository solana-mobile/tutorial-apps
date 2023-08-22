use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};

use crate::pdas::farm_account::Farm;

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(
        mut,
        has_one = player,
        has_one = owner,
    )]
    pub farm: Account<'info, Farm>,

    // --------- Programs ----------
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,

    #[account(mut)]
    pub player: Signer<'info>,

    #[account(mut)]
    pub owner: Signer<'info>,
}

pub fn run_withdraw(ctx: Context<Withdraw>) -> Result<()> {
    let transfer_amount: u64 = ctx.accounts.player.lamports();
    let cpi_context = CpiContext::new(
        ctx.accounts.system_program.to_account_info(),
        Transfer {
            from: ctx.accounts.player.to_account_info(),
            to: ctx.accounts.owner.to_account_info(),
        },
    );
    transfer(cpi_context, transfer_amount)?;

    {
        let farm = &mut ctx.accounts.farm;

        farm.harvest_points = 0;
    }

    Ok(())
}
