use anchor_lang::prelude::*;

declare_id!("RkoKjJ7UVatbVegugEjq11Q5agPynBAZV2VhPrNp5kH");

#[program]
pub mod farming_idle_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
