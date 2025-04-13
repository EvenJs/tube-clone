import { db } from "@/db";
import { categories } from "@/db/schema";

const categoryNames = ["Cas", "Comedy", "Education", "Gaming", "Music", "Sports", "News and politics", "People and blogs", "Pets and animals", "Travel and events"];

async function main() {
  console.log("seeding categories...")

  try {
    const values = categoryNames.map((name) => ({
      name, description: `videos related to ${name.toLowerCase()}`
    }))
    await db.insert(categories).values(values)
  } catch (error) {
    console.error("error seeding categories: ", error)
    process.exit(1);
  }
}
main()