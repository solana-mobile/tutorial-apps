#![allow(deprecated)]
#![allow(unexpected_cfgs)]

use anchor_lang::prelude::*;
use std::ops::DerefMut;

declare_id!("J59JrEwy2LXNdME3hurENgiNDJosRM1YHLUECc1JTijh");

#[program]
pub mod basic_counter {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let counter = ctx.accounts.counter.deref_mut();
        let bump = ctx.bumps.counter;

        *counter = Counter { count: 0, bump };

        Ok(())
    }

    pub fn increment(ctx: Context<Increment>, amount: u64) -> Result<()> {
        require!(amount >= 1 && amount <= 100, ErrorCode::InvalidAmount);

        ctx.accounts.counter.count += amount;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = payer,
        space = Counter::SIZE,
        seeds = [b"counter"],
        bump
    )]
    counter: Account<'info, Counter>,
    #[account(mut)]
    payer: Signer<'info>,
    system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(
        mut,
        seeds = [b"counter"],
        bump = counter.bump
    )]
    counter: Account<'info, Counter>,
}

#[account]
pub struct Counter {
    pub count: u64,
    pub bump: u8,
}

impl Counter {
    pub const SIZE: usize = 8 + 8 + 1;
}

#[error_code]
pub enum ErrorCode {
    #[msg("Cannot get the bump.")]
    CannotGetBump,
    #[msg("The amount must be between 1 and 100.")]
    InvalidAmount,
}
