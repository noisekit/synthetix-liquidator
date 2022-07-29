import { assert, describe, test, clearStore, afterEach } from 'matchstick-as/assembly/index';
import { Address, BigInt } from '@graphprotocol/graph-ts';
import {
	handleAccountFlaggedForLiquidation,
	handleAccountRemovedFromLiquidation,
	handleAccountLiquidated,
} from '../src/liquidator';
import {
	createAccountFlaggedForLiquidationEvent,
	createAccountRemovedFromLiquidationEvent,
	createAccountLiquidatedEvent,
} from './liquidator-utils';

import { logStore } from 'matchstick-as/assembly/store';
// 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
const FROM = '0xa16081f360e3847006db660bae1c6d1b2e17ec2a';
const ADDRESS = '0x0000000000000000000000000000000000000001';
const ADDRESS2 = '0x0000000000000000000000000000000000000002';
const ADDRESS3 = '0x0000000000000000000000000000000000000003';

describe('Describe entity assertions', () => {
	afterEach(() => {
		logStore();
		clearStore();
	});

	test('StakerEntity marked for liquidation is created and stored', () => {
		handleAccountFlaggedForLiquidation(
			createAccountFlaggedForLiquidationEvent(Address.fromString(ADDRESS), BigInt.fromI32(234))
		);

		assert.entityCount('StakerEntity', 1);
		assert.fieldEquals('StakerEntity', ADDRESS, 'from', FROM);
		assert.fieldEquals('StakerEntity', ADDRESS, 'account', ADDRESS);
		assert.fieldEquals('StakerEntity', ADDRESS, 'count', '1');
		assert.fieldEquals('StakerEntity', ADDRESS, 'timestamp', '234');
		assert.fieldEquals('StakerEntity', ADDRESS, 'status', 'FLAGGED');

		assert.entityCount('LiquidationEvent', 1);
		assert.fieldEquals('LiquidationEvent', `234-${ADDRESS}`, 'status', 'FLAGGED');
	});

	test('StakerEntity unmarked for liquidation is created and stored', () => {
		handleAccountRemovedFromLiquidation(
			createAccountRemovedFromLiquidationEvent(Address.fromString(ADDRESS), BigInt.fromI32(567))
		);

		assert.entityCount('StakerEntity', 1);
		assert.fieldEquals('StakerEntity', ADDRESS, 'from', FROM);
		assert.fieldEquals('StakerEntity', ADDRESS, 'account', ADDRESS);
		assert.fieldEquals('StakerEntity', ADDRESS, 'count', '1');
		assert.fieldEquals('StakerEntity', ADDRESS, 'timestamp', '567');
		assert.fieldEquals('StakerEntity', ADDRESS, 'status', 'CLEAR');

		assert.entityCount('LiquidationEvent', 1);
		assert.fieldEquals('LiquidationEvent', `567-${ADDRESS}`, 'status', 'CLEAR');
	});

	test('StakerEntity marked and then unmarked for liquidation is created and stored', () => {
		handleAccountFlaggedForLiquidation(
			createAccountFlaggedForLiquidationEvent(Address.fromString(ADDRESS), BigInt.fromI32(234))
		);

		assert.entityCount('StakerEntity', 1);
		assert.fieldEquals('StakerEntity', ADDRESS, 'from', FROM);
		assert.fieldEquals('StakerEntity', ADDRESS, 'account', ADDRESS);
		assert.fieldEquals('StakerEntity', ADDRESS, 'count', '1');
		assert.fieldEquals('StakerEntity', ADDRESS, 'timestamp', '234');
		assert.fieldEquals('StakerEntity', ADDRESS, 'status', 'FLAGGED');

		assert.entityCount('LiquidationEvent', 1);
		assert.fieldEquals('LiquidationEvent', `234-${ADDRESS}`, 'status', 'FLAGGED');

		handleAccountRemovedFromLiquidation(
			createAccountRemovedFromLiquidationEvent(Address.fromString(ADDRESS), BigInt.fromI32(567))
		);

		assert.entityCount('StakerEntity', 1);
		assert.fieldEquals('StakerEntity', ADDRESS, 'from', FROM);
		assert.fieldEquals('StakerEntity', ADDRESS, 'account', ADDRESS);
		assert.fieldEquals('StakerEntity', ADDRESS, 'count', '2');
		assert.fieldEquals('StakerEntity', ADDRESS, 'timestamp', '567');
		assert.fieldEquals('StakerEntity', ADDRESS, 'status', 'CLEAR');

		assert.entityCount('LiquidationEvent', 2);
		assert.fieldEquals('LiquidationEvent', `567-${ADDRESS}`, 'status', 'CLEAR');
	});

	test('multiple StakerEntities marked for liquidation by a single account', () => {
		handleAccountFlaggedForLiquidation(
			createAccountFlaggedForLiquidationEvent(Address.fromString(ADDRESS), BigInt.fromI32(111))
		);
		handleAccountFlaggedForLiquidation(
			createAccountFlaggedForLiquidationEvent(Address.fromString(ADDRESS2), BigInt.fromI32(112))
		);
		handleAccountFlaggedForLiquidation(
			createAccountFlaggedForLiquidationEvent(Address.fromString(ADDRESS3), BigInt.fromI32(113))
		);

		assert.entityCount('StakerEntity', 3);

		assert.fieldEquals('StakerEntity', ADDRESS, 'from', FROM);
		assert.fieldEquals('StakerEntity', ADDRESS, 'count', '1');
		assert.fieldEquals('StakerEntity', ADDRESS, 'status', 'FLAGGED');
		assert.fieldEquals('StakerEntity', ADDRESS2, 'from', FROM);
		assert.fieldEquals('StakerEntity', ADDRESS2, 'count', '1');
		assert.fieldEquals('StakerEntity', ADDRESS2, 'status', 'FLAGGED');
		assert.fieldEquals('StakerEntity', ADDRESS3, 'from', FROM);
		assert.fieldEquals('StakerEntity', ADDRESS3, 'count', '1');
		assert.fieldEquals('StakerEntity', ADDRESS3, 'status', 'FLAGGED');

		assert.entityCount('LiquidationEvent', 3);
		assert.fieldEquals('LiquidationEvent', `111-${ADDRESS}`, 'status', 'FLAGGED');
		assert.fieldEquals('LiquidationEvent', `112-${ADDRESS2}`, 'status', 'FLAGGED');
		assert.fieldEquals('LiquidationEvent', `113-${ADDRESS3}`, 'status', 'FLAGGED');

		handleAccountRemovedFromLiquidation(
			createAccountRemovedFromLiquidationEvent(Address.fromString(ADDRESS), BigInt.fromI32(222))
		);
		handleAccountRemovedFromLiquidation(
			createAccountRemovedFromLiquidationEvent(Address.fromString(ADDRESS2), BigInt.fromI32(223))
		);

		assert.entityCount('StakerEntity', 3);

		assert.fieldEquals('StakerEntity', ADDRESS, 'from', FROM);
		assert.fieldEquals('StakerEntity', ADDRESS, 'count', '2');
		assert.fieldEquals('StakerEntity', ADDRESS, 'status', 'CLEAR');
		assert.fieldEquals('StakerEntity', ADDRESS2, 'from', FROM);
		assert.fieldEquals('StakerEntity', ADDRESS2, 'count', '2');
		assert.fieldEquals('StakerEntity', ADDRESS2, 'status', 'CLEAR');
		assert.fieldEquals('StakerEntity', ADDRESS3, 'from', FROM);
		assert.fieldEquals('StakerEntity', ADDRESS3, 'count', '1');
		assert.fieldEquals('StakerEntity', ADDRESS3, 'status', 'FLAGGED');

		assert.entityCount('LiquidationEvent', 5);
		assert.fieldEquals('LiquidationEvent', `222-${ADDRESS}`, 'status', 'CLEAR');
		assert.fieldEquals('LiquidationEvent', `223-${ADDRESS2}`, 'status', 'CLEAR');
	});

	test('account liquidated by another user', () => {
		handleAccountFlaggedForLiquidation(
			createAccountFlaggedForLiquidationEvent(Address.fromString(ADDRESS), BigInt.fromI32(111))
		);
		assert.fieldEquals('StakerEntity', ADDRESS, 'count', '1');
		assert.fieldEquals('StakerEntity', ADDRESS, 'timestamp', '111');
		assert.fieldEquals('StakerEntity', ADDRESS, 'status', 'FLAGGED');

		assert.entityCount('LiquidationEvent', 1);
		assert.fieldEquals('LiquidationEvent', `111-${ADDRESS}`, 'status', 'FLAGGED');

		handleAccountRemovedFromLiquidation(
			createAccountRemovedFromLiquidationEvent(Address.fromString(ADDRESS), BigInt.fromI32(222))
		);

		assert.fieldEquals('StakerEntity', ADDRESS, 'count', '2');
		assert.fieldEquals('StakerEntity', ADDRESS, 'timestamp', '222');
		assert.fieldEquals('StakerEntity', ADDRESS, 'status', 'CLEAR');

		assert.entityCount('LiquidationEvent', 2);
		assert.fieldEquals('LiquidationEvent', `222-${ADDRESS}`, 'status', 'CLEAR');

		handleAccountFlaggedForLiquidation(
			createAccountFlaggedForLiquidationEvent(Address.fromString(ADDRESS), BigInt.fromI32(333))
		);

		assert.fieldEquals('StakerEntity', ADDRESS, 'count', '3');
		assert.fieldEquals('StakerEntity', ADDRESS, 'timestamp', '333');
		assert.fieldEquals('StakerEntity', ADDRESS, 'status', 'FLAGGED');

		assert.entityCount('LiquidationEvent', 3);
		assert.fieldEquals('LiquidationEvent', `333-${ADDRESS}`, 'status', 'FLAGGED');

		handleAccountLiquidated(
			createAccountLiquidatedEvent(
				Address.fromString(ADDRESS),
				BigInt.fromI32(10),
				BigInt.fromI32(20),
				Address.fromString(ADDRESS2)
			)
		);

		assert.entityCount('StakerEntity', 1);

		assert.fieldEquals('StakerEntity', ADDRESS, 'count', '4');
		// Timestamp from tx block
		assert.fieldEquals('StakerEntity', ADDRESS, 'timestamp', '1');
		assert.fieldEquals('StakerEntity', ADDRESS, 'status', 'LIQUIDATED');
		// Check that we use liquidator address, not the tx initiator
		assert.fieldEquals('StakerEntity', ADDRESS, 'from', ADDRESS2);

		// Assert events
		assert.entityCount('LiquidationEvent', 4);
		assert.fieldEquals('LiquidationEvent', `1-${ADDRESS}`, 'status', 'LIQUIDATED');
	});

	test('account liquidated self', () => {
		handleAccountFlaggedForLiquidation(
			createAccountFlaggedForLiquidationEvent(Address.fromString(ADDRESS), BigInt.fromI32(111))
		);
		assert.fieldEquals('StakerEntity', ADDRESS, 'count', '1');
		assert.fieldEquals('StakerEntity', ADDRESS, 'timestamp', '111');
		assert.fieldEquals('StakerEntity', ADDRESS, 'status', 'FLAGGED');

		assert.entityCount('LiquidationEvent', 1);
		assert.fieldEquals('LiquidationEvent', `111-${ADDRESS}`, 'status', 'FLAGGED');

		handleAccountLiquidated(
			createAccountLiquidatedEvent(
				Address.fromString(ADDRESS),
				BigInt.fromI32(10),
				BigInt.fromI32(20),
				Address.fromString(ADDRESS)
			)
		);

		assert.entityCount('StakerEntity', 1);

		assert.fieldEquals('StakerEntity', ADDRESS, 'count', '2');
		// Timestamp from tx block
		assert.fieldEquals('StakerEntity', ADDRESS, 'timestamp', '1');
		assert.fieldEquals('StakerEntity', ADDRESS, 'status', 'SELF_LIQUIDATED');
		// Check that we use liquidator address, not the tx initiator
		assert.fieldEquals('StakerEntity', ADDRESS, 'from', ADDRESS);

		assert.entityCount('LiquidationEvent', 2);
		assert.fieldEquals('LiquidationEvent', `1-${ADDRESS}`, 'status', 'SELF_LIQUIDATED');
	});
});
