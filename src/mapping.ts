import { Transfer } from '../generated/Polkamon/Polkamon'
import { NFTOwner, NFTBalance } from '../generated/schema'
import { BigInt } from "@graphprotocol/graph-ts"

export function handleTransfer(event: Transfer): void {
    let id = event.params.tokenId.toHex()
    let nftOwner = NFTOwner.load(id)
    if (nftOwner == null) {
        nftOwner = new NFTOwner(id)
    }
    nftOwner.owner = event.params.to
    nftOwner.save()

    let previousOwner = event.params.from.toHex()
    let nftBalance = NFTBalance.load(previousOwner)
    if (nftBalance != null) {
        if (nftBalance.amount > BigInt.fromI32(0)) {
            nftBalance.amount = nftBalance.amount - BigInt.fromI32(1)
        }
        nftBalance.save()
    }    

    let newOwner = event.params.to.toHex()
    let newNFTBalance = NFTBalance.load(newOwner)
    if (newNFTBalance == null) {
        newNFTBalance = new NFTBalance(newOwner)
        newNFTBalance.amount = BigInt.fromI32(0)
    }
    newNFTBalance.amount = newNFTBalance.amount + BigInt.fromI32(1)
    newNFTBalance.save()
}