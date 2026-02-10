<!DOCTYPE html>
<html>
<head>
    <title>Professional Resume Form</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"> <style>
        * { box-sizing: border-box; } /* Layout fix */
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f0f2f5; padding: 20px; margin: 0; }
        
        .container { 
            max-width: 900px; margin: auto; background: white; 
            padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); 
        }
        
        h2 { text-align: center; color: #014C83; margin-bottom: 30px; font-size: 28px; }
        
        .section { 
            background: #fff; border: 1px solid #e1e4e8; 
            border-radius: 8px; padding: 20px; margin-bottom: 25px; 
            border-left: 5px solid #014C83; /* Blue accent */
        }
        
        .section h3 { margin-top: 0; color: #333; font-size: 18px; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 20px; }
        
        label { font-weight: 600; display: block; margin-top: 15px; color: #444; font-size: 14px; }
        .optional-label { color: #888; font-weight: normal; font-size: 13px; }
        
        input, textarea, select { 
            width: 100%; padding: 12px; margin-top: 8px; 
            border: 1px solid #ccc; border-radius: 6px; font-size: 15px; transition: 0.3s;
        }
        input:focus, textarea:focus { border-color: #014C83; outline: none; box-shadow: 0 0 5px rgba(1, 76, 131, 0.2); }
        
        /* 🔥 RESPONSIVE GRID SYSTEM */
        .row { display: flex; flex-wrap: wrap; gap: 20px; }
        .col { flex: 1 1 300px; /* Minimum width 300px, uske baad wrap karega */ }
        
        button { 
            background: linear-gradient(135deg, #014C83 0%, #0066b2 100%); 
            color: white; padding: 18px; border: none; width: 100%; 
            font-size: 18px; font-weight: bold; border-radius: 8px; 
            cursor: pointer; margin-top: 20px; transition: transform 0.2s;
        }
        button:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(0,0,0,0.2); }

        /* Mobile specific adjustments */
        @media (max-width: 600px) {
            .container { padding: 15px; }
            .section { padding: 15px; }
            h2 { font-size: 22px; }
        }
    </style>
</head>
<body>

<div class="container">
    <h2>🚀 Build Your Professional Resume</h2>
    <form action="api/generate_resume.php" method="POST" enctype="multipart/form-data">
        
        <input type="hidden" name="template_name" value="blue_theme">

        <div class="section">
            <h3>1. Personal Details</h3>
            <div class="row">
                <div class="col"><label>Full Name</label><input type="text" name="fullname" required placeholder="Mr. Rohan Kumar"></div>
                <div class="col"><label>Course/Branch</label><input type="text" name="course" placeholder="Ex: DIPLOMA IN MECHANICAL"></div>
            </div>
            
            <div class="row">
                <div class="col"><label>Father's Name</label><input type="text" name="father_name"></div>
                <div class="col"><label>Mother's Name</label><input type="text" name="mother_name"></div>
            </div>

            <div class="row">
                <div class="col"><label>Date of Birth</label><input type="date" name="dob"></div>
                <div class="col"><label>Gender</label><select name="gender"><option>Male</option><option>Female</option><option>Other</option></select></div>
            </div>
            
            <div class="row">
                <div class="col"><label>Nationality</label><input type="text" name="nationality" value="INDIAN"></div>
                <div class="col"><label>Blood Group</label><input type="text" name="blood_group"></div>
            </div>

             <div class="row">
                <div class="col"><label>Marital Status</label><input type="text" name="marital_status" value="Unmarried"></div>
                <div class="col"><label>Languages Known</label><input type="text" name="languages" value="Hindi & English"></div>
            </div>

            <label>Profile Image (Passport Size)</label>
            <input type="file" name="profile_pic" accept="image/*">
        </div>

        <div class="section">
            <h3>2. Contact & Address</h3>
            <div class="row">
                <div class="col"><label>Phone Number</label><input type="tel" name="phone" placeholder="+91 9876543210" required></div>
                <div class="col"><label>Email ID</label><input type="email" name="email" placeholder="example@gmail.com" required></div>
            </div>
            
            <label style="margin-top: 20px; border-top: 1px dashed #ccc; padding-top: 10px;">Permanent Address:</label>
            <div class="row">
                <div class="col"><input type="text" name="vill" placeholder="Village / City / Street"></div>
                <div class="col"><input type="text" name="po" placeholder="Post Office"></div>
            </div>
            <div class="row">
                <div class="col"><input type="text" name="ps" placeholder="Police Station"></div>
                <div class="col"><input type="text" name="dist" placeholder="District"></div>
            </div>
            <div class="row">
                <div class="col"><input type="text" name="pin" placeholder="Pincode"></div>
            </div>
        </div>

        <div class="section">
            <h3>3. Education Qualification</h3>
            
            <label>10th (Matriculation) Details <span style="color:red">*</span></label>
            <div class="row">
                <div class="col"><input type="text" name="matric_board" placeholder="Board (e.g. CBSE)" required></div>
                <div class="col"><input type="text" name="matric_school" placeholder="School Name" required></div>
                <div class="col"><input type="number" name="matric_year" placeholder="Passing Year" required></div>
                <div class="col"><input type="text" name="matric_percent" placeholder="Percentage / CGPA" required></div>
            </div>
            <br>
            
            <label>12th (Intermediate) Details <span class="optional-label">(Optional - Leave blank if not applicable)</span></label>
            <div class="row">
                <div class="col"><input type="text" name="inter_board" placeholder="Board"></div>
                <div class="col"><input type="text" name="inter_school" placeholder="College Name"></div>
                <div class="col"><input type="number" name="inter_year" placeholder="Year"></div>
                <div class="col"><input type="text" name="inter_percent" placeholder="%"></div>
            </div>
        </div>

        <div class="section">
            <h3>4. Technical Qualification (Diploma)</h3>
            <div class="row">
                <div class="col"><label>Institute Name</label><input type="text" name="diploma_college" placeholder="Ex: GOVT POLYTECHNIC"></div>
                <div class="col"><label>Session</label><input type="text" name="diploma_session" placeholder="Ex: 2023-2026"></div>
            </div>
            
            <h4>Semester Marks (SGPA) <span class="optional-label">(Fill completed semesters)</span></h4>
            <div class="row">
                <div class="col"><input type="text" name="sem1" placeholder="Sem 1"></div>
                <div class="col"><input type="text" name="sem2" placeholder="Sem 2"></div>
                <div class="col"><input type="text" name="sem3" placeholder="Sem 3"></div>
            </div>
             <div class="row">
                <div class="col"><input type="text" name="sem4" placeholder="Sem 4"></div>
                <div class="col"><input type="text" name="sem5" placeholder="Sem 5"></div>
                <div class="col"><input type="text" name="sem6" placeholder="Sem 6"></div>
            </div>
        </div>

        <div class="section">
            <h3>5. Skills & Experience</h3>
            
            <label>Profile Summary (About You)</label>
            <textarea name="profile_summary" rows="3" placeholder="To obtain a challenging position..."></textarea>
            
            <div class="row">
                <div class="col">
                    <label>Hard Skills / Technical Skills</label>
                    <input type="text" name="skills" placeholder="Ex: Java, Python, AutoCAD, Welding, CNC">
                    <span class="optional-label">Comma separated</span>
                </div>
                <div class="col">
                    <label>Soft Skills</label>
                    <input type="text" name="soft_skills" placeholder="Ex: Leadership, Teamwork, Communication, Time Management">
                    <span class="optional-label">Comma separated</span>
                </div>
            </div>

            <label>Internship / Training Details</label>
            <textarea name="internship" rows="3" placeholder="Ex: 1 Month training at Tata Steel..."></textarea>

            <label>Hobbies</label>
            <input type="text" name="hobbies" placeholder="Ex: Cricket, Reading, Traveling">

            <label>Place (For Declaration)</label>
            <input type="text" name="place" placeholder="Ex: JAMSHEDPUR">
        </div>

        <button type="submit">Download Resume PDF 📄</button>
    </form>
</div>

</body>
</html>