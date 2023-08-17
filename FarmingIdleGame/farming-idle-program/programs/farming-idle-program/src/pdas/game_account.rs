use anchor_lang::prelude::*;

#[derive(Copy, Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct LeaderboardEntry {
    pub wallet: Pubkey,
    pub points: u64,
}

#[account]
pub struct Game {
    pub owner: Pubkey,
    pub mint: Pubkey,
    pub bump: u8,
    pub date_created: i64,
}
