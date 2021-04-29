import { Birth, Transfer } from '../generated/CryptoKitties/CryptoKitties'
import { NFTOwner, NFTBalance } from '../generated/schema'
import { BigInt } from "@graphprotocol/graph-ts"

export function handleBirth(event: Birth): void {
    let kitty = new NFTOwner(event.params.kittyId.toHex())
    kitty.owner = event.params.owner
    kitty.save()

    let kittyBalance = new NFTBalance(event.params.owner.toHex())
    kittyBalance.amount = BigInt.fromI32(1)
    kittyBalance.save()
}

export function handleTransfer(event: Transfer): void {
    let id1 = event.params.tokenId.toHex()
    let kitty = NFTOwner.load(id1)
    if (kitty == null) {
        kitty = new NFTOwner(id1)
    }
    kitty.owner = event.params.to
    kitty.save()

    let previousOwner = event.params.from.toHex()
    let kittyBalance = NFTBalance.load(previousOwner)
    if (kittyBalance != null) {
        if (kittyBalance.amount > BigInt.fromI32(0)) {
            kittyBalance.amount = kittyBalance.amount - BigInt.fromI32(1)
        }
        kittyBalance.save()
    }    

    let newOwner = event.params.to.toHex()
    let newKittyBalance = NFTBalance.load(newOwner)
    if (newKittyBalance == null) {
        newKittyBalance = new NFTBalance(newOwner)
        newKittyBalance.amount = BigInt.fromI32(0)
    }
    newKittyBalance.amount = newKittyBalance.amount + BigInt.fromI32(1)
    newKittyBalance.save()
}