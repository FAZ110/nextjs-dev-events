'use server';

import connectDB from "../mongodb";
import Event from '@/database/event.model'

export const getSimilarEventsBySlug = async (slug: string) => {
    try {
        await connectDB();

        const event = await Event.findOne({slug});
        
        if (!event) {
            console.log(`Event with slug "${slug}" not found`);
            return [];
        }

        const similarEvents = await Event.find({ 
            _id: {$ne: event._id}, 
            tags: {$in: event.tags}
        })
        .limit(3) 
        .lean();

        console.log(`Found ${similarEvents.length} similar events for slug "${slug}"`);
        
        return similarEvents;
        
    } catch (error) {
        console.error('Error fetching similar events:', error);
        return [];
    }
}