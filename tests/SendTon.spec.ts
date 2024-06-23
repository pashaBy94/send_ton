import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { SendTon } from '../wrappers/SendTon';
import '@ton/test-utils';

describe('SendTon', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let sendTon: SandboxContract<SendTon>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        sendTon = blockchain.openContract(await SendTon.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await sendTon.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            },
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: sendTon.address,
            deploy: true,
            success: true,
        });
        await sendTon.send(
            deployer.getSender(),
            {
                value: toNano('500'),
            },
            null,
        );
    });

    it('should deploy', async () => {
        const balance = await sendTon.getBalance();
    });

    it('should send ton', async () => {
        const result = await sendTon.send(
            deployer.getSender(),
            {
                value: toNano('0.02'),
            },
            'withdraw all',
        );
        const balance = await sendTon.getBalance();
        expect(Number(balance)).toEqual(0);
    });

    it('should send ton to any user', async () => {
        let user: SandboxContract<TreasuryContract> = await blockchain.treasury('user');
        const result = await sendTon.send(
            user.getSender(),
            {
                value: toNano('0.02'),
            },
            'withdraw all',
        );
        const balance = await sendTon.getBalance();
        expect(Math.round(Number(balance))).toEqual(500);
    });

    it('should withdraw many', async () => {
        const balance = await sendTon.getBalance();
        const result = await sendTon.send(
            deployer.getSender(),
            {
                value: toNano('0.4'),
            },
            {
                $$type: 'Withdraw',
                amount: toNano('4'),
            },
        );
        const resultBalance = await sendTon.getBalance();
        console.log(resultBalance);

        expect(Number(resultBalance)).toEqual(Number(balance) - 4);
    });

    it('should send ton with safe', async () => {
        const result = await sendTon.send(
            deployer.getSender(),
            {
                value: toNano('0.4'),
            },
            'withdraw safe',
        );
        const balance = await sendTon.getBalance();
        expect(balance).toEqual('0.01');
    });
});
