import { store } from "../../store";
import {
  processWinner,
  fetchAllAuctions,
} from "../../store/slices/auctionSlice";
import { fetchNotifications } from "../../store/slices/notificationSlice";

let expirationCheckInterval = null;
let processedAuctions = new Set();
let processingAuctions = new Set();

export const startExpirationChecker = () => {
  if (expirationCheckInterval) return;

  console.log("Starting expiration checker service");

  expirationCheckInterval = setInterval(async () => {
    await checkExpiredAuctions();
  }, 30000);

  checkExpiredAuctions();
};

export const stopExpirationChecker = () => {
  if (expirationCheckInterval) {
    clearInterval(expirationCheckInterval);
    expirationCheckInterval = null;
    processedAuctions.clear();
    processingAuctions.clear();
    console.log("Stopped expiration checker");
  }
};

const checkExpiredAuctions = async () => {
  try {
    const state = store.getState();
    const auctions = state.auction.auctions;
    const now = new Date();

    console.log(`Checking ${auctions?.length || 0} auctions for expiration`);

    const expiredAuctions = (auctions || []).filter((auction) => {
      if (!auction?.expireDate) return false;
      if (
        processedAuctions.has(auction.id) ||
        processingAuctions.has(auction.id)
      )
        return false;
      if (auction.status === "ended" || auction.status === "denied") {
        processedAuctions.add(auction.id);
        return false;
      }
      const expireDate = new Date(auction.expireDate);
      const isExpired = now >= expireDate;
      if (isExpired) {
        console.log(
          `Auction ${auction.id} is expired. Expire date: ${expireDate}, Now: ${now}`,
        );
      }
      return isExpired;
    });

    console.log(`Found ${expiredAuctions.length} expired auctions to process`);

    for (const auction of expiredAuctions) {
      if (processingAuctions.has(auction.id)) continue;

      processingAuctions.add(auction.id);

      try {
        console.log(`Processing expired auction ${auction.id}...`);

        await store.dispatch(processWinner(auction.id)).unwrap();

        processedAuctions.add(auction.id);
        console.log(`Successfully processed auction ${auction.id}`);
      } catch (error) {
        console.error(`Error processing auction ${auction.id}:`, error);
        processingAuctions.delete(auction.id);
      }
    }

    // Refresh auctions after processing all expired ones
    if (expiredAuctions.length > 0) {
      await store.dispatch(fetchAllAuctions());

      const userId = store.getState().auth.user?.id;
      if (userId) {
        store.dispatch(fetchNotifications(userId));
      }
    }
  } catch (error) {
    console.error("Error in expiration checker:", error);
  }
};

export const clearProcessedAuctions = () => {
  processedAuctions.clear();
  processingAuctions.clear();
  console.log("Cleared processed auctions sets");
};
