import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { CreaterContract } from '../wrappers/CreaterContract';
import '@ton/test-utils';
import { CreaterContract2 } from '../build/CreaterContract/tact_CreaterContract2';
import { CreaterCont } from '../build/CreaterContract/tact_CreaterCont';

describe('CreaterContract', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let createrContract1: SandboxContract<CreaterContract>;
    let createrContract2: SandboxContract<CreaterContract2>;
    let createrCont: SandboxContract<CreaterCont>;
    beforeEach(async () => {
        blockchain = await Blockchain.create();

        createrContract1 = blockchain.openContract(await CreaterContract.fromInit());
        createrContract2 = blockchain.openContract(await CreaterContract2.fromInit());
        createrCont = blockchain.openContract(await CreaterCont.fromInit(2n));

        deployer = await blockchain.treasury('deployer');

        const deployResult1 = await createrContract1.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            },
        );
        expect(deployResult1.transactions).toHaveTransaction({
            from: deployer.address,
            to: createrContract1.address,
            deploy: true,
            success: true,
        });
        const deployResult2 = await createrContract2.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            },
        );
        expect(deployResult2.transactions).toHaveTransaction({
            from: deployer.address,
            to: createrContract2.address,
            deploy: true,
            success: true,
        });
        const deployContract = await createrCont.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            },
        );
        expect(deployContract.transactions).toHaveTransaction({
            from: deployer.address,
            to: createrCont.address,
            deploy: true,
            success: true,
        });
    });

    it('should address', async () => {
        const contract = await createrContract1.getAddress();
        const contract1 = await createrContract2.getAnOtherAddress();
        expect(contract).toEqualAddress(contract1);

        const contract2 = await createrContract2.getAddress();
        const contract22 = await createrContract1.getAnOtherAddress();
        expect(contract2).toEqualAddress(contract22);
    });
    it('should deploy new address', async () => {
        const contractAddress = await createrCont.getAddress();
        console.log('contractAddress  - ', contractAddress);

        const contract = await createrCont.getAnOtherAddress(14n);
        createrCont = blockchain.openContract(await CreaterCont.fromInit(14n));
        await createrCont.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'SendAddress',
                addressId: 14n,
            },
        );
        let newContract = await createrCont.getAddress();
        expect(contract.toString()).toEqual(newContract.toString());
    });
});
