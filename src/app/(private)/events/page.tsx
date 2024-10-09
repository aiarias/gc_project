import { Button } from "@/components/ui/button";
import { db } from "@/drizzle/db";
import { auth, redirectToSignIn } from "@clerk/nextjs/server";
import { CalendarPlus, CalendarRange } from "lucide-react";
import Link from "next/link";

export default async function EventsPage() {
    const { userId } = auth()

    if (userId == null) return redirectToSignIn()

    const events = await db.query.EventTable.findMany({
        where: ({ clerkUserId }, { eq }) => eq(clerkUserId, userId),
        orderBy: ({ createdAt }, { desc }) => desc(createdAt),
    })


    return (
      <>
        <div className="flex gap-4 item-baseline">
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-semibold mb-6">Events</h1>
            <Button asChild>
                <Link href="/events/new"> <CalendarPlus className="mr-4 size-6"/> New event </Link>
            </Button>
        </div>
        {events.length > 0 ? (<h1>Events</h1>) : (
            <div className="flex flex-col items-center gap-4">
                <CalendarRange className="size-16 mx-auto" />
                You do not have any events yet. Create one now!
                <Button size="lg" className="text-lg" asChild>
                <Link href="/events/new"> <CalendarPlus className="mr-4 size-6"/> New event </Link>
                </Button>
            </div>
        )}   
      </>  
        
    )
}