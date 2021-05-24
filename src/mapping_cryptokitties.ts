import { Birth, Transfer, CryptoKitties } from '../generated/CryptoKitties/CryptoKitties'
import { NftOwner } from '../generated/schema'
import { BigInt, Address } from "@graphprotocol/graph-ts"

export function handleBirth(event: Birth): void {
    let id = event.address.toHex() + '#' + event.params.kittyId.toHex()
    let kitty = new NftOwner(id)
    kitty.tokenId = event.params.kittyId
    kitty.owner = event.params.owner
    kitty.contract = event.address
    kitty.save()

    // let kittyBalance = new NftBalance(event.params.owner.toHex())
    // kittyBalance.amount = BigInt.fromI32(1)
    // kittyBalance.save()
}

export function handleTransfer(event: Transfer): void {
    let id = event.address.toHex() + '#' + event.params.tokenId.toHex()
    let kitty = NftOwner.load(id)
    if (kitty == null) {
        kitty = new NftOwner(id)
        kitty.tokenId = event.params.tokenId
        kitty.contract = event.address
    }
    kitty.owner = event.params.to
    kitty.save()

    //update the amount of tokens hold by the owner "to"
    //first bind the contract address in order to be able to access the public 
    //methods of the contract
    // let contract = CryptoKitties.bind(event.address) 
    // let kittyBalance = new NftBalance(event.params.to.toHex())
    // kittyBalance.amount = contract.balanceOf(event.params.to)
    // kittyBalance.totalSupply = contract.totalSupply()
    // kittyBalance.save()

    // let previousOwner = event.params.from.toHex()
    // let kittyBalance = NftBalance.load(previousOwner)
    // if (kittyBalance != null) {
    //     if (kittyBalance.amount > BigInt.fromI32(0)) {
    //         kittyBalance.amount = kittyBalance.amount - BigInt.fromI32(1)
    //     }
    //     kittyBalance.save()
    // }    

    // let newOwner = event.params.to.toHex()
    // let newKittyBalance = NftBalance.load(newOwner)
    // if (newKittyBalance == null) {
    //     newKittyBalance = new NftBalance(newOwner)
    //     newKittyBalance.amount = BigInt.fromI32(0)
    // }
    // newKittyBalance.amount = newKittyBalance.amount + BigInt.fromI32(1)
    // newKittyBalance.save()
}
