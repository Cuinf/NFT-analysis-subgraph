import { Transfer, ERC721 } from '../generated/Polkamon/ERC721'
import { NftOwner, NftBalance } from '../generated/schema'
import { BigInt } from "@graphprotocol/graph-ts"

export function handleTransfer(event: Transfer): void {
    let id = event.address.toHex() + '#' + event.params.tokenId.toHex()
    let nftOwner = NftOwner.load(id)
    if (nftOwner == null) {
        nftOwner = new NftOwner(id)
    }
    nftOwner.tokenId = event.params.tokenId
    nftOwner.owner = event.params.to
    nftOwner.contract = event.address
    nftOwner.save()

    //update the amount ot the token 
    let contract = ERC721.bind(event.address)
    let nftBalance = new NftBalance(event.params.to.toHex())
    nftBalance.amount = contract.balanceOf(event.params.to)
    nftBalance.totalSupply = contract.totalSupply()
    nftBalance.save()

    // let previousOwner = event.params.from.toHex()
    // let nftBalance = NftBalance.load(previousOwner)
    // if (nftBalance != null) {
    //     if (nftBalance.amount > BigInt.fromI32(0)) {
    //         nftBalance.amount = nftBalance.amount - BigInt.fromI32(1)
    //     }
    //     nftBalance.save()
    // }    

    // let newOwner = event.params.to.toHex()
    // let newNFTBalance = NftBalance.load(newOwner)
    // if (newNFTBalance == null) {
    //     newNFTBalance = new NftBalance(newOwner)
    //     newNFTBalance.amount = BigInt.fromI32(0)
    // }
    // newNFTBalance.amount = newNFTBalance.amount + BigInt.fromI32(1)
    // newNFTBalance.save()
}