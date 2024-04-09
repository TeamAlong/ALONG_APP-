import axios from "axios";



export const createNft = async(nftDetails) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_UNDERDOG_API_KEY}`,
            },
        }

        const underdogApiEndpoint = process.env.NEXT_PUBLIC_UNDERDOG_API_URL
        const projectId = process.env.NEXT_PUBLIC_UNDERDOG_PROJECT_ID

        // Prepare the attributes object based on the provided details
        const attributes = {
            "Ride Status": nftDetails.rideStatus,
            "Driver ID": nftDetails.driverId,
            "Rider ID": nftDetails.riderId,
            "Trip Date": nftDetails.currentDate,
            "Trip Price": nftDetails.fare,
        };

      const nftData = {
            name: "Along Ride Ticket",
            symbol: "ALGNFT",
            image: "https://imgur.com/bOfqNwQ.jpeg", 
            attributes: attributes,
        };

        const createNftResponse = await axios.post(
            `${underdogApiEndpoint}/v2/projects/${projectId}/nfts`,
            nftData,
            config,
        );
        console.log(createNftResponse);


        return createNftResponse.data;
    } catch (error) {
        console.log(error);
        return null;
    }


}
