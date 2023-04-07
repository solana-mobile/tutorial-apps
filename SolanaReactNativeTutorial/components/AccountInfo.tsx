import React from 'react';
import {LAMPORTS_PER_SOL, PublicKey} from '@solana/web3.js';
import { StyleSheet, View, Text } from 'react-native';
import { Authorization } from '../screens/MainScreen'

type AccountInfoProps = Readonly<{
  authorization: Authorization;
  balance: number | null;
}>

function convertLamportsToSOL(lamports: number) {
  return new Intl.NumberFormat(undefined, {maximumFractionDigits: 1}).format(
    (lamports || 0) / LAMPORTS_PER_SOL,
  )
}

const LAMPORTS_PER_AIRDROP = 100000000;

export default function AccountInfo({ authorization, balance }: AccountInfoProps) {
  return (
    <View />
  );
}
