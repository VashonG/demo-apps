function Protected() {
    return (
        <div>
            <h3>Protected content</h3>
        </div>
    );
}
export default Protected;
import { getSession } from 'next-auth/react';
import Moralis from 'moralis';

function Protected({ message }) {
    return (
        <div>
            <h3>Protected content</h3>
            <p>{message}</p>
        </div>
    );
}

export async function getServerSideProps(context) {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: '/signin',
                permanent: false,
            },
        };
    }


    return {
        props: {
            message:
                // if user has at least one NFT he will get congrats message
                nftList.raw.total > 0 ? 'Nice! You have our NFT' : "Sorry, you don't have our NFT",
        },
    };
}
export default Protected;
import { getSession } from 'next-auth/react';
import Moralis from 'moralis';
import { EvmChain } from '@moralisweb3/evm-utils';

function Protected({ message, nftList }) {
    return (
        <div>
            <h3>Protected content</h3>
            <p>{message}</p>
            <pre>{JSON.stringify(nftList, null, 2)}</pre>
        </div>
    );
}

export async function getServerSideProps(context) {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: '/signin',
                permanent: false,
            },
        };
    }

    await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });

    const nftList = await Moralis.EvmApi.nft.getWalletNFTs({
        chain: EvmChain.ETHEREUM,
        address: session.user.address,
        tokenAddress: '0x...',
    });

    return {
        props: {
            message:
                // if user has at least one NFT he will get protected content
                nftList.raw.total > 0 ? 'Nice! You have our NFT' : "Sorry, you don't have our NFT",
            nftList: nftList.raw.result,
        },
    };
}
export default Protected;
