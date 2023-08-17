use anchor_lang::prelude::*;
use anchor_lang::solana_program::log::sol_log_compute_units;

use instructions::harvest_instruction::*;
use instructions::initialize_farm_instruction::*;

declare_id!("RkoKjJ7UVatbVegugEjq11Q5agPynBAZV2VhPrNp5kH");

// Instructions
mod instructions;

// Accounts
mod pdas;

#[program]
pub mod farming_idle_program {
    use super::*;

    pub fn initialize(ctx: Context<InitializeFarm>, bump: u8) -> Result<()> {
        run_initialize_farm(ctx, bump)?;
        sol_log_compute_units();

        Ok(())
    }

    pub fn harvest(ctx: Context<Harvest>) -> Result<()> {
        run_harvest(ctx)?;
        sol_log_compute_units();

        Ok(())
    }
}
