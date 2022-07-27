import {
	assert,
	describe,
	test,
	clearStore,
	beforeAll,
	afterAll,
} from 'matchstick-as/assembly/index';
import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts';
import { StakerEntity } from '../generated/schema';
import { AccountFlaggedForLiquidation } from '../generated/Liquidator/Liquidator';
import {
	handleAccountFlaggedForLiquidation,
	handleAccountRemovedFromLiquidation,
} from '../src/liquidator';
import {
	createAccountFlaggedForLiquidationEvent,
	createAccountRemovedFromLiquidationEvent,
} from './liquidator-utils';

// 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
const FROM = '0xa16081f360e3847006db660bae1c6d1b2e17ec2a';
const ADDRESS = '0x0000000000000000000000000000000000000001';

describe('Describe entity assertions', () => {
	test('StakerEntity marked for liquidation is created and stored', () => {
		handleAccountFlaggedForLiquidation(
			createAccountFlaggedForLiquidationEvent(Address.fromString(ADDRESS), BigInt.fromI32(234))
		);

		assert.entityCount('StakerEntity', 1);
		assert.fieldEquals('StakerEntity', ADDRESS, 'from', FROM);
		assert.fieldEquals('StakerEntity', ADDRESS, 'account', ADDRESS);
		assert.fieldEquals('StakerEntity', ADDRESS, 'count', '1');
		assert.fieldEquals('StakerEntity', ADDRESS, 'deadline', '234');
		assert.fieldEquals('StakerEntity', ADDRESS, 'time', 'null');
		assert.fieldEquals('StakerEntity', ADDRESS, 'flagged', 'true');

		clearStore();
	});

	test('StakerEntity unmarked for liquidation is created and stored', () => {
		handleAccountRemovedFromLiquidation(
			createAccountRemovedFromLiquidationEvent(Address.fromString(ADDRESS), BigInt.fromI32(567))
		);

		assert.entityCount('StakerEntity', 1);
		assert.fieldEquals('StakerEntity', ADDRESS, 'from', FROM);
		assert.fieldEquals('StakerEntity', ADDRESS, 'account', ADDRESS);
		assert.fieldEquals('StakerEntity', ADDRESS, 'count', '1');
		assert.fieldEquals('StakerEntity', ADDRESS, 'deadline', 'null');
		assert.fieldEquals('StakerEntity', ADDRESS, 'time', '567');
		assert.fieldEquals('StakerEntity', ADDRESS, 'flagged', 'false');

		clearStore();
	});

	test('StakerEntity marked and then unmarked for liquidation is created and stored', () => {
		handleAccountFlaggedForLiquidation(
			createAccountFlaggedForLiquidationEvent(Address.fromString(ADDRESS), BigInt.fromI32(234))
		);

		assert.entityCount('StakerEntity', 1);
		assert.fieldEquals('StakerEntity', ADDRESS, 'from', FROM);
		assert.fieldEquals('StakerEntity', ADDRESS, 'account', ADDRESS);
		assert.fieldEquals('StakerEntity', ADDRESS, 'count', '1');
		assert.fieldEquals('StakerEntity', ADDRESS, 'deadline', '234');
		assert.fieldEquals('StakerEntity', ADDRESS, 'time', 'null');
		assert.fieldEquals('StakerEntity', ADDRESS, 'flagged', 'true');

		handleAccountRemovedFromLiquidation(
			createAccountRemovedFromLiquidationEvent(Address.fromString(ADDRESS), BigInt.fromI32(567))
		);

		assert.entityCount('StakerEntity', 1);
		assert.fieldEquals('StakerEntity', ADDRESS, 'from', FROM);
		assert.fieldEquals('StakerEntity', ADDRESS, 'account', ADDRESS);
		assert.fieldEquals('StakerEntity', ADDRESS, 'count', '2');
		assert.fieldEquals('StakerEntity', ADDRESS, 'deadline', 'null');
		assert.fieldEquals('StakerEntity', ADDRESS, 'time', '567');
		assert.fieldEquals('StakerEntity', ADDRESS, 'flagged', 'false');

		clearStore();
	});
});
