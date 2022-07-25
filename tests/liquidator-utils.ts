import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  AccountFlaggedForLiquidation,
  AccountRemovedFromLiquidation,
  CacheUpdated,
  OwnerChanged,
  OwnerNominated
} from "../generated/Liquidator/Liquidator"

export function createAccountFlaggedForLiquidationEvent(
  account: Address,
  deadline: BigInt
): AccountFlaggedForLiquidation {
  let accountFlaggedForLiquidationEvent = changetype<
    AccountFlaggedForLiquidation
  >(newMockEvent())

  accountFlaggedForLiquidationEvent.parameters = new Array()

  accountFlaggedForLiquidationEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  accountFlaggedForLiquidationEvent.parameters.push(
    new ethereum.EventParam(
      "deadline",
      ethereum.Value.fromUnsignedBigInt(deadline)
    )
  )

  return accountFlaggedForLiquidationEvent
}

export function createAccountRemovedFromLiquidationEvent(
  account: Address,
  time: BigInt
): AccountRemovedFromLiquidation {
  let accountRemovedFromLiquidationEvent = changetype<
    AccountRemovedFromLiquidation
  >(newMockEvent())

  accountRemovedFromLiquidationEvent.parameters = new Array()

  accountRemovedFromLiquidationEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  accountRemovedFromLiquidationEvent.parameters.push(
    new ethereum.EventParam("time", ethereum.Value.fromUnsignedBigInt(time))
  )

  return accountRemovedFromLiquidationEvent
}

export function createCacheUpdatedEvent(
  name: Bytes,
  destination: Address
): CacheUpdated {
  let cacheUpdatedEvent = changetype<CacheUpdated>(newMockEvent())

  cacheUpdatedEvent.parameters = new Array()

  cacheUpdatedEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromFixedBytes(name))
  )
  cacheUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "destination",
      ethereum.Value.fromAddress(destination)
    )
  )

  return cacheUpdatedEvent
}

export function createOwnerChangedEvent(
  oldOwner: Address,
  newOwner: Address
): OwnerChanged {
  let ownerChangedEvent = changetype<OwnerChanged>(newMockEvent())

  ownerChangedEvent.parameters = new Array()

  ownerChangedEvent.parameters.push(
    new ethereum.EventParam("oldOwner", ethereum.Value.fromAddress(oldOwner))
  )
  ownerChangedEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownerChangedEvent
}

export function createOwnerNominatedEvent(newOwner: Address): OwnerNominated {
  let ownerNominatedEvent = changetype<OwnerNominated>(newMockEvent())

  ownerNominatedEvent.parameters = new Array()

  ownerNominatedEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownerNominatedEvent
}
