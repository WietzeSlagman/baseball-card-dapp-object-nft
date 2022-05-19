import { E } from '@endo/eventual-send';
import { assert, details as X } from '@agoric/assert';

const getCardAuctionDetail = async ({ publicFacet, card }) => {
  return E(publicFacet).getSessionDetailsForKey(card);
};

const makeBidOfferForCard = async ({
  walletP,
  // card,
  publicFacet,
  cardPurse,
  tokenPurse,
  price,
}) => {
  // CODECHANGE6: hardcode nftobject matching an element in /api/cards.js

  const card = {
    url: 'https://agoric.com',
    name: 'Sleve McDichael',
  };

  assert(card, X`At least one card must be chosen to purchase`);

  console.info('SELECTED CARD: ', card);
  const invitation = await E(publicFacet).makeBidInvitationForKey(harden(card));

  console.info('INVITATION: ', invitation);
  const offerConfig = {
    // JSONable ID for this offer.  This is scoped to the origin.
    id: Date.now(),
    invitation,
    proposalTemplate: {
      want: {
        Asset: {
          pursePetname: cardPurse.pursePetname,
          value: harden([card]),
        },
      },
      give: {
        Bid: {
          pursePetname: tokenPurse.pursePetname,
          value: price,
        },
      },
    },
  };
  console.info('OFFER CONFIG: ', offerConfig);

  return E(walletP).addOffer(offerConfig);
};

export { makeBidOfferForCard, getCardAuctionDetail };
