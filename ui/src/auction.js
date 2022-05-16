import { E } from '@endo/eventual-send';
import { assert, details as X } from '@agoric/assert';

const getCardAuctionDetail = async ({ publicFacet, card }) => {
  return E(publicFacet).getSessionDetailsForKey(card);
};

const makeBidOfferForCard = async ({
  walletP,
  card,
  publicFacet,
  cardPurse,
  tokenPurse,
  price,
}) => {
  assert(card, X`At least one card must be chosen to purchase`);

  const invitation = await E(publicFacet).makeBidInvitationForKey({
    url: 'https://agoric.com',
    name: 'Sleve McDichael',
  });

  const offerConfig = {
    // JSONable ID for this offer.  This is scoped to the origin.
    id: Date.now(),
    invitation,
    proposalTemplate: {
      want: {
        Asset: {
          pursePetname: cardPurse.pursePetname,
          value: harden([{
            url: 'https://agoric.com',
            name: 'Sleve McDichael',
          }]),
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

  return E(walletP).addOffer(offerConfig);
};

export { makeBidOfferForCard, getCardAuctionDetail };
