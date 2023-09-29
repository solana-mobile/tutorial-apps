use anchor_lang::prelude::*;

#[derive(Copy, Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct LeaderboardEntry {
    pub wallet: Pubkey,
    pub points: u64,
}

#[account]
pub struct Leaderboard {
    pub leaderboard: [LeaderboardEntry; 5],
}
