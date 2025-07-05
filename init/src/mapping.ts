import {
  Transfer,
  Deposit,
  DepositRequest,
  RedeemRequest,
  SettleDeposit,
  SettleRedeem,
  StateUpdated,
  OperatorSet,
  RatesUpdated,
  FeeReceiverUpdated,
  TotalAssetsUpdated,
  NewTotalAssetsUpdated,
  HighWaterMarkUpdated,
  WhitelistUpdated,
  WhitelistManagerUpdated,
  WhitelistDisabled,
  ValuationManagerUpdated,
  OwnershipTransferStarted,
  OwnershipTransferred,
  Referral,
  Paused,
  Unpaused,
  Initialized,
  Withdraw,
  DepositRequestCanceled
} from "../generated/Vault/Vault"

import {
  TransferEvent,
  DepositEvent,
  DepositRequestEvent,
  RedeemRequestEvent,
  SettleDepositEvent,
  SettleRedeemEvent,
  StateUpdatedEvent,
  OperatorSetEvent,
  RatesUpdatedEvent,
  FeeReceiverUpdatedEvent,
  TotalAssetsUpdatedEvent,
  NewTotalAssetsUpdatedEvent,
  HighWaterMarkUpdatedEvent,
  WhitelistUpdatedEvent,
  WhitelistManagerUpdatedEvent,
  WhitelistDisabledEvent,
  ValuationManagerUpdatedEvent,
  OwnershipTransferStartedEvent,
  OwnershipTransferredEvent,
  ReferralEvent,
  PausedEvent,
  UnpausedEvent,
  InitializedEvent,
  WithdrawEvent,
  DepositRequestCanceledEvent
} from "../generated/schema"

export function handleTransfer(event: Transfer): void {
  let entity = new TransferEvent(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString()
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.value = event.params.value
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}

export function handleDeposit(event: Deposit): void {
  let entity = new DepositEvent(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString()
  )
  entity.sender = event.params.sender
  entity.owner = event.params.owner
  entity.assets = event.params.assets
  entity.shares = event.params.shares
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}

export function handleWithdraw(event: Withdraw): void {
  let entity = new WithdrawEvent(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString()
  )
  entity.sender = event.params.sender
  entity.receiver = event.params.receiver
  entity.owner = event.params.owner
  entity.assets = event.params.assets
  entity.shares = event.params.shares
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}

export function handleDepositRequest(event: DepositRequest): void {
  let entity = new DepositRequestEvent(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString()
  )
  entity.controller = event.params.controller
  entity.owner = event.params.owner
  entity.requestId = event.params.requestId
  entity.sender = event.params.sender
  entity.assets = event.params.assets
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}

export function handleRedeemRequest(event: RedeemRequest): void {
  let entity = new RedeemRequestEvent(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString()
  )
  entity.controller = event.params.controller
  entity.owner = event.params.owner
  entity.requestId = event.params.requestId
  entity.sender = event.params.sender
  entity.shares = event.params.shares
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}

export function handleSettleDeposit(event: SettleDeposit): void {
  let entity = new SettleDepositEvent(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString()
  )
  entity.epochId = event.params.epochId
  entity.settledId = event.params.settledId
  entity.totalAssets = event.params.totalAssets
  entity.totalSupply = event.params.totalSupply
  entity.assetsDeposited = event.params.assetsDeposited
  entity.sharesMinted = event.params.sharesMinted
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}

export function handleSettleRedeem(event: SettleRedeem): void {
  let entity = new SettleRedeemEvent(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString()
  )
  entity.epochId = event.params.epochId
  entity.settledId = event.params.settledId
  entity.totalAssets = event.params.totalAssets
  entity.totalSupply = event.params.totalSupply
  entity.assetsWithdrawed = event.params.assetsWithdrawed
  entity.sharesBurned = event.params.sharesBurned
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}

export function handleStateUpdated(event: StateUpdated): void {
  let entity = new StateUpdatedEvent(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString()
  )
  entity.state = event.params.state
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}

export function handleOperatorSet(event: OperatorSet): void {
  let entity = new OperatorSetEvent(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString()
  )
  entity.controller = event.params.controller
  entity.operator = event.params.operator
  entity.approved = event.params.approved
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}

export function handleRatesUpdated(event: RatesUpdated): void {
  let entity = new RatesUpdatedEvent(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString()
  )
  entity.oldManagementRate = event.params.oldRates.managementRate
  entity.oldPerformanceRate = event.params.oldRates.performanceRate
  entity.newManagementRate = event.params.newRate.managementRate
  entity.newPerformanceRate = event.params.newRate.performanceRate
  entity.timestamp = event.params.timestamp
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}

export function handleTotalAssetsUpdated(event: TotalAssetsUpdated): void {
  let entity = new TotalAssetsUpdatedEvent(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString()
  )
  entity.totalAssets = event.params.totalAssets
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}

export function handleNewTotalAssetsUpdated(event: NewTotalAssetsUpdated): void {
  let entity = new NewTotalAssetsUpdatedEvent(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString()
  )
  entity.totalAssets = event.params.totalAssets
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}

export function handleHighWaterMarkUpdated(event: HighWaterMarkUpdated): void {
  let entity = new HighWaterMarkUpdatedEvent(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString()
  )
  entity.oldHighWaterMark = event.params.oldHighWaterMark
  entity.newHighWaterMark = event.params.newHighWaterMark
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}

export function handleWhitelistUpdated(event: WhitelistUpdated): void {
  let entity = new WhitelistUpdatedEvent(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString()
  )
  entity.account = event.params.account
  entity.authorized = event.params.authorized
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}

export function handleWhitelistDisabled(event: WhitelistDisabled): void {
  let entity = new WhitelistDisabledEvent(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString()
  )
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}

export function handleFeeReceiverUpdated(event: FeeReceiverUpdated): void {
  let entity = new FeeReceiverUpdatedEvent(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString()
  )
  entity.oldReceiver = event.params.oldReceiver
  entity.newReceiver = event.params.newReceiver
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}

export function handleValuationManagerUpdated(event: ValuationManagerUpdated): void {
  let entity = new ValuationManagerUpdatedEvent(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString()
  )
  entity.oldManager = event.params.oldManager
  entity.newManager = event.params.newManager
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}

export function handleWhitelistManagerUpdated(event: WhitelistManagerUpdated): void {
  let entity = new WhitelistManagerUpdatedEvent(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString()
  )
  entity.oldManager = event.params.oldManager
  entity.newManager = event.params.newManager
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}

export function handleReferral(event: Referral): void {
  let entity = new ReferralEvent(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString()
  )
  entity.referral = event.params.referral
  entity.owner = event.params.owner
  entity.requestId = event.params.requestId
  entity.assets = event.params.assets
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}

export function handleDepositRequestCanceled(event: DepositRequestCanceled): void {
  let entity = new DepositRequestCanceledEvent(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString()
  )
  entity.requestId = event.params.requestId
  entity.controller = event.params.controller
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}

export function handlePaused(event: Paused): void {
  let entity = new PausedEvent(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString()
  )
  entity.account = event.params.account
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}

export function handleUnpaused(event: Unpaused): void {
  let entity = new UnpausedEvent(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString()
  )
  entity.account = event.params.account
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}

export function handleOwnershipTransferStarted(event: OwnershipTransferStarted): void {
  let entity = new OwnershipTransferStartedEvent(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString()
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  let entity = new OwnershipTransferredEvent(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString()
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}

export function handleInitialized(event: Initialized): void {
  let entity = new InitializedEvent(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString()
  )
  entity.version = event.params.version
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}

// Je continue avec les autres handlers ? 