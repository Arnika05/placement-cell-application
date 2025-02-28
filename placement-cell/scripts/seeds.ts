
const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

const main = async () => {
  try {
    await PrismaClient.category.deleteMany(); 
    await database.category.createMany({
      data: [
        { name: "Software Development" },
        { name: "Web Development" },
        { name: "Mobile App Development" },
        { name: "Data Science" },
        { name: "Machine Learning" },
        { name: "Artificial Intelligence" },
        { name: "UI/UX Design" },
        { name: "Product Management" },
        { name: "Project Management" },
        { name: "Cloud Computing" },
        { name: "Business Analysis" },
        { name: "Sales" },
        { name: "Marketing" },
        { name: "Customer Support" },
        { name: "Human Resources" },
        { name: "Finance" },
      ],
    });
    console.log("Success");
  } catch (error) {
    console.log(`Error on seeding the database categories : ${error}`);
  }
};

main();