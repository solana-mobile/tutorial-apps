use anchor_lang::prelude::*;

#[error_code]
pub enum CodeErrors {
    #[msg("Not a valid upgrade index")]
    NotAValidUpgrade,
    #[msg("Not a valid amount")]
    NotAValidAmount,
    #[msg("Not enough to fund upgrade")]
    NotEnoughToFundUpgrade,
}
