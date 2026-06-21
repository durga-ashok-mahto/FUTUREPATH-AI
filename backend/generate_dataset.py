import os
import csv
import random

def generate_balanced_dataset(output_path, num_records=250):
    # Ensure directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # Career categories and specific generation parameters
    career_paths = [
        "AI Engineer",
        "Data Scientist",
        "Web Developer",
        "Cyber Security Analyst",
        "UI/UX Designer",
        "Cloud Engineer"
    ]
    
    records_per_career = num_records // len(career_paths)
    extra_records = num_records % len(career_paths)
    
    dataset = []
    
    # Rules translation for generation:
    # 1. High CGPA + High Coding + AI Interest -> AI Engineer
    # 2. High Aptitude + Analytics Interest -> Data Scientist
    # 3. High Coding + Web Interest -> Web Developer
    # 4. High Security Interest -> Cyber Security Analyst
    # 5. High Creativity/Communication + Design Interest -> UI/UX Designer
    # 6. Cloud Interest + Good Coding -> Cloud Engineer
    
    for career in career_paths:
        # Determine count for this class
        count = records_per_career
        if extra_records > 0:
            count += 1
            extra_records -= 1
            
        for _ in range(count):
            if career == "AI Engineer":
                cgpa = round(random.uniform(8.2, 10.0), 2)
                coding = "High"
                comm = random.choice(["Medium", "High"])
                aptitude = random.randint(80, 100)
                interest = "AI"
                
            elif career == "Data Scientist":
                cgpa = round(random.uniform(7.2, 9.8), 2)
                coding = random.choice(["Medium", "High"])
                comm = random.choice(["Low", "Medium", "High"])
                aptitude = random.randint(76, 100)
                interest = "Data Science"
                
            elif career == "Web Developer":
                cgpa = round(random.uniform(6.0, 9.5), 2)
                coding = random.choice(["Medium", "High"])
                comm = random.choice(["Low", "Medium", "High"])
                aptitude = random.randint(50, 90)
                interest = "Web Development"
                
            elif career == "Cyber Security Analyst":
                cgpa = round(random.uniform(6.0, 9.5), 2)
                coding = random.choice(["Low", "Medium", "High"])
                comm = random.choice(["Low", "Medium", "High"])
                aptitude = random.randint(62, 100)
                interest = "Cybersecurity"
                
            elif career == "UI/UX Designer":
                cgpa = round(random.uniform(6.0, 9.6), 2)
                coding = random.choice(["Low", "Medium"])
                comm = "High" # Represents High Creativity
                aptitude = random.randint(50, 88)
                interest = "UI/UX Design"
                
            elif career == "Cloud Engineer":
                cgpa = round(random.uniform(6.8, 9.8), 2)
                coding = random.choice(["Medium", "High"])
                comm = random.choice(["Low", "Medium", "High"])
                aptitude = random.randint(65, 95)
                interest = "Cloud Computing"
            
            dataset.append({
                "CGPA": cgpa,
                "CodingSkill": coding,
                "CommunicationSkill": comm,
                "AptitudeLevel": aptitude,
                "InterestArea": interest,
                "CareerPath": career
            })
            
    # Shuffle to distribute classes randomly
    random.shuffle(dataset)
    
    # Write to CSV
    with open(output_path, mode='w', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=["CGPA", "CodingSkill", "CommunicationSkill", "AptitudeLevel", "InterestArea", "CareerPath"])
        writer.writeheader()
        for row in dataset:
            writer.writerow(row)
            
    print(f"Dataset successfully created with {len(dataset)} records at: {output_path}")

if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.abspath(__file__))
    generate_balanced_dataset(os.path.join(base_dir, "datasets", "career_dataset.csv"), 250)
