use anchor_lang::prelude::*;

#[account]
pub struct Farm {
    pub initialized: bool,
    pub owner: Pubkey,
    pub player: Pubkey,
    pub bump: u8,
    pub date_created: i64,
    pub last_harvested: i64,
    pub harvest_points: u64,
    pub farm_upgrades: [u16; 16],
}
