use crate::globals::constants::UPGRADE_MULTIPLIER;

// This function will return inf ( or u64::MAX ) if the result is too large
pub fn get_upgrade_cost(base_cost: u64, n: u16, count: u8) -> u64 {
    let mut total_cost = 0_u64;

    for x in 0..count {
        total_cost = total_cost.saturating_add(nth_upgrade_cost(base_cost, n + x as u16));
    }

    total_cost
}

// This function will return inf ( or i64::MAX ) if the result is too large
pub fn nth_upgrade_cost(base_cost: u64, n: u16) -> u64 {
    let base_cost = base_cost as f64;
    let result = base_cost * UPGRADE_MULTIPLIER.powi(n as i32);
    result.round() as u64
}
