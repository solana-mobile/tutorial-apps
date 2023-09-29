use crate::globals::constants::{BASE_COSTS, BASE_POINTS};
use crate::globals::errors::CodeErrors;
use crate::globals::helpers::get_upgrade_cost;
use crate::pdas::farm_account::Farm;

use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct UpgradeFarm<'info> {
    #[account(
        mut,
        has_one = player,
    )]
    pub farm: Account<'info, Farm>,

    #[account(mut)]
    pub player: Signer<'info>,
}

pub fn run_upgrade_farm(ctx: Context<UpgradeFarm>, upgrade_index: u8, amount: u8) -> Result<()> {
    let farm = &mut ctx.accounts.farm;

    if amount == 0 {
        return Err(error!(CodeErrors::NotAValidAmount));
    }

    if upgrade_index >= BASE_COSTS.len() as u8 || upgrade_index >= BASE_POINTS.len() as u8 {
        return Err(error!(CodeErrors::NotAValidUpgrade));
    }

    {
        let cost = get_upgrade_cost(
            BASE_COSTS[upgrade_index as usize],
            farm.farm_upgrades[upgrade_index as usize],
            amount,
        );

        if farm.harvest_points < cost {
            return Err(error!(CodeErrors::NotEnoughToFundUpgrade));
        }

        farm.harvest_points -= cost;
        farm.farm_upgrades[upgrade_index as usize] += amount as u16;
    }

    Ok(())
}
