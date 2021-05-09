import { Birth, Transfer } from '../generated/CryptoKitties/CryptoKitties'
import { NftOwner, NftBalance } from '../generated/schema'
import { BigInt } from "@graphprotocol/graph-ts"

export function handleBirth(event: Birth): void {
    let id = event.transaction.hash.toHex()
    let kitty = new NftOwner(id)
    kitty.tokenId = event.params.kittyId.toHex()
    kitty.owner = event.params.owner
    kitty.save()

    let kittyBalance = new NftBalance(event.params.owner.toHex())
    kittyBalance.amount = BigInt.fromI32(1)
    kittyBalance.save()
}

export function handleTransfer(event: Transfer): void {
    let id = event.transaction.hash.toHex()
    let kitty = NftOwner.load(id)
    if (kitty == null) {
        kitty = new NftOwner(id)
        kitty.tokenId = event.params.tokenId
    }
    kitty.owner = event.params.to
    kitty.save()

    let previousOwner = event.params.from.toHex()
    let kittyBalance = NftBalance.load(previousOwner)
    if (kittyBalance != null) {
        if (kittyBalance.amount > BigInt.fromI32(0)) {
            kittyBalance.amount = kittyBalance.amount - BigInt.fromI32(1)
        }
        kittyBalance.save()
    }    

    let newOwner = event.params.to.toHex()
    let newKittyBalance = NftBalance.load(newOwner)
    if (newKittyBalance == null) {
        newKittyBalance = new NftBalance(newOwner)
        newKittyBalance.amount = BigInt.fromI32(0)
    }
    newKittyBalance.amount = newKittyBalance.amount + BigInt.fromI32(1)
    newKittyBalance.save()
}