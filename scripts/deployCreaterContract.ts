import { toNano } from '@ton/core';
import { CreaterContract } from '../wrappers/CreaterContract';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const createrContract = provider.open(await CreaterContract.fromInit());

    await createrContract.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(createrContract.address);

    // run methods on `createrContract`
}
