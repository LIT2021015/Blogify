import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  try {
   
    const {searchParams}=new URL(req.url)
       const key=searchParams.get("key")
       console.log(key);

        const posts= await prisma.post.findMany(
          {  where:{

                OR:[

                    {
                        desc:{

                            contains:key,
                             mode:'insensitive'
                        }
                    },
                    {
                         title:{

                            contains:key,
                             mode:'insensitive'
                        }
                    }

                ]
            }
        }
        )
        //  console.log(posts);

     return new NextResponse(
        JSON.stringify(posts, { status: 200 })
      );
  } catch (err) {
    console.log("error")
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }, { status: 500 })
    );
  }
};