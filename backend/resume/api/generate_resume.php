<?php
// api/generate_resume.php
require 'dompdf/autoload.inc.php'; 
use Dompdf\Dompdf;
use Dompdf\Options;

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    // --- DATA RECEIVE ---
    $name = strtoupper($_POST['fullname']);
    $course = strtoupper($_POST['course']);
    $father = strtoupper($_POST['father_name']);
    $mother = strtoupper($_POST['mother_name']);
    $dob = $_POST['dob'];
    $gender = strtoupper($_POST['gender']);
    $nationality = strtoupper($_POST['nationality']);
    $blood = $_POST['blood_group'];
    $marital = strtoupper($_POST['marital_status']);
    $lang = strtoupper($_POST['languages']);
    $phone = $_POST['phone'];
    $email = $_POST['email'];
    
    // Address
    $vill = strtoupper($_POST['vill']);
    $po = strtoupper($_POST['po']);
    $ps = strtoupper($_POST['ps']);
    $dist = strtoupper($_POST['dist']);
    $pin = $_POST['pin'];

    // Education (12th check karenge)
    $matric_board = strtoupper($_POST['matric_board']);
    $matric_school = strtoupper($_POST['matric_school']);
    $matric_year = $_POST['matric_year'];
    $matric_percent = $_POST['matric_percent'];
    
    $inter_board = strtoupper($_POST['inter_board']);
    $inter_school = strtoupper($_POST['inter_school']);
    $inter_year = $_POST['inter_year'];
    $inter_percent = $_POST['inter_percent'];

    $dip_college = strtoupper($_POST['diploma_college']);
    $dip_session = $_POST['diploma_session'];
    $sem1 = $_POST['sem1']; $sem2 = $_POST['sem2']; $sem3 = $_POST['sem3'];
    $sem4 = $_POST['sem4']; $sem5 = $_POST['sem5']; $sem6 = $_POST['sem6'];

    $summary = $_POST['profile_summary'];
    $internship = $_POST['internship'];
    $place = strtoupper($_POST['place']);
    $date = date('d/m/Y');

    // --- LIST PROCESSING (Skills & Hobbies) ---
    
    // Hobbies
    $hobbiesArr = explode(',', $_POST['hobbies']);
    $hobbiesLi = "";
    foreach($hobbiesArr as $h) {
        if(trim($h) != "") $hobbiesLi .= "<li>".strtoupper(trim($h))."</li>";
    }

    // Hard Skills
    $skillsArr = explode(',', $_POST['skills']);
    $skillsLi = "";
    foreach($skillsArr as $s) {
        if(trim($s) != "") $skillsLi .= "<li>".strtoupper(trim($s))."</li>";
    }

    // Soft Skills (NEW)
    $softSkillsArr = explode(',', $_POST['soft_skills']);
    $softSkillsLi = "";
    foreach($softSkillsArr as $ss) {
        if(trim($ss) != "") $softSkillsLi .= "<li>".strtoupper(trim($ss))."</li>";
    }

    // Image Logic
    $profileImg = "";
    if(isset($_FILES['profile_pic']) && $_FILES['profile_pic']['tmp_name'] != "") {
        $path = $_FILES['profile_pic']['tmp_name'];
        $type = pathinfo($path, PATHINFO_EXTENSION);
        $data = file_get_contents($path);
        $base64 = 'data:image/' . $type . ';base64,' . base64_encode($data);
        $profileImg = "<img src='$base64' width='140px' height='160px' style='border: 4px solid white; border-radius: 5px; margin-bottom: 10px;'>";
    }

    // --- 12th Grade Logic (Show only if filled) ---
    $interRow = "";
    if(!empty($inter_school)) {
        $interRow = "
        <tr>
            <td>12th / Inter</td><td>$inter_board</td><td>$inter_school</td><td>$inter_year</td><td>$inter_percent</td>
        </tr>";
    }

    // --- HTML TEMPLATE ---

    $html = '
    <html>
    <head>
        <style>
            @page { margin: 0px; }
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; font-size: 11px; color: #333; }
            
            /* Main Layout Table */
            .main-table { width: 100%; height: 100%; border-collapse: collapse; }
            .left-cell { background-color: #014C83; color: white; width: 32%; vertical-align: top; padding: 20px; }
            .right-cell { background-color: #fff; width: 68%; vertical-align: top; padding: 25px; }

            /* Headers */
            h1 { font-size: 26px; margin: 0 0 5px 0; color: #014C83; text-transform: uppercase; letter-spacing: 1px; }
            h2 { font-size: 14px; margin: 0 0 15px 0; color: #555; font-weight: normal; text-transform: uppercase; }
            
            /* Left Panel Headers */
            h3.hd1 { 
                border-bottom: 1px solid rgba(255,255,255,0.5); 
                padding-bottom: 5px; margin-bottom: 8px; margin-top: 25px; 
                font-size: 13px; font-weight: bold; letter-spacing: 1px;
            }

            /* Right Panel Headers */
            h3.col-title { 
                color: #014C83; border-bottom: 2px solid #014C83; 
                padding-bottom: 5px; margin-top: 25px; margin-bottom: 10px; 
                font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;
            }

            /* Tables */
            .info-table { width: 100%; font-size: 11px; color: #eee; }
            .info-table td { padding: 4px 0; vertical-align: top; }
            
            .edu-table, .tech-table { width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 10px; }
            .edu-table th, .edu-table td, .tech-table th, .tech-table td { border: 1px solid #ccc; padding: 6px; text-align: center; }
            .edu-table th, .tech-table th { background-color: #f2f2f2; color: #333; font-weight: bold; }

            .personal-table { width: 100%; font-size: 11px; color: #333; line-height: 1.6; }
            .personal-table td { padding: 3px 0; }

            ul { padding-left: 15px; margin: 0; line-height: 1.5; }
            li { margin-bottom: 4px; }
            p { margin: 0 0 8px 0; text-align: justify; line-height: 1.5; font-size: 11px;}
        </style>
    </head>
    <body>

    <table class="main-table">
        <tr>
            <td class="left-cell">
                <div style="text-align: center;">'.$profileImg.'</div>

                <h3 class="hd1">CONTACT INFO</h3>
                <table class="info-table">
                    <tr><td width="30">VILL</td><td>: '.$vill.'</td></tr>
                    <tr><td>PO</td><td>: '.$po.'</td></tr>
                    <tr><td>PS</td><td>: '.$ps.'</td></tr>
                    <tr><td>DIST</td><td>: '.$dist.'</td></tr>
                    <tr><td>PIN</td><td>: '.$pin.'</td></tr>
                    <tr><td colspan="2" style="padding-top:10px;"></td></tr>
                    <tr><td>PH</td><td>: '.$phone.'</td></tr>
                    <tr><td>EMAIL</td><td>: '.$email.'</td></tr>
                </table>

                <h3 class="hd1">TECHNICAL SKILLS</h3>
                <ul>'.$skillsLi.'</ul>

                <h3 class="hd1">SOFT SKILLS</h3>
                <ul>'.$softSkillsLi.'</ul>

                <h3 class="hd1">HOBBIES</h3>
                <ul>'.$hobbiesLi.'</ul>

                <h3 class="hd1">DECLARATION</h3>
                <p style="font-size: 10px; opacity: 0.9;">I hereby declare that the above information is true to the best of my knowledge.</p>
            </td>

            <td class="right-cell">
                <h1>'.$name.'</h1>
                <h2>'.$course.'</h2>
                
                <h3 class="col-title">CAREER OBJECTIVE</h3>
                <p>'.$summary.'</p>

                <h3 class="col-title">EDUCATIONAL QUALIFICATION</h3>
                <table class="edu-table">
                    <tr><th>Class</th><th>Board</th><th>School/College</th><th>Year</th><th>%</th></tr>
                    <tr>
                        <td>10th</td><td>'.$matric_board.'</td><td>'.$matric_school.'</td><td>'.$matric_year.'</td><td>'.$matric_percent.'</td>
                    </tr>
                    '.$interRow.' </table>

                <h3 class="col-title">TECHNICAL QUALIFICATION (DIPLOMA)</h3>
                <p>Pursuing <b>'.$course.'</b> from <b>'.$dip_college.'</b> (Session: '.$dip_session.')</p>
                <table class="tech-table">
                    <tr><th>Sem</th><th>SGPA</th><th>Sem</th><th>SGPA</th><th>Sem</th><th>SGPA</th></tr>
                    <tr><td>1st</td><td>'.$sem1.'</td><td>3rd</td><td>'.$sem3.'</td><td>5th</td><td>'.$sem5.'</td></tr>
                    <tr><td>2nd</td><td>'.$sem2.'</td><td>4th</td><td>'.$sem4.'</td><td>6th</td><td>'.$sem6.'</td></tr>
                </table>

                <h3 class="col-title">INTERNSHIP & TRAINING</h3>
                <p>'.$internship.'</p>

                <h3 class="col-title">PERSONAL DETAILS</h3>
                <table class="personal-table">
                    <tr><td width="130"><b>Father\'s Name</b></td><td>: '.$father.'</td></tr>
                    <tr><td><b>Mother\'s Name</b></td><td>: '.$mother.'</td></tr>
                    <tr><td><b>Date of Birth</b></td><td>: '.$dob.'</td></tr>
                    <tr><td><b>Gender</b></td><td>: '.$gender.'</td></tr>
                    <tr><td><b>Marital Status</b></td><td>: '.$marital.'</td></tr>
                    <tr><td><b>Nationality</b></td><td>: '.$nationality.'</td></tr>
                    <tr><td><b>Blood Group</b></td><td>: '.$blood.'</td></tr>
                    <tr><td><b>Languages Known</b></td><td>: '.$lang.'</td></tr>
                </table>

                <br><br>
                <table width="100%">
                    <tr>
                        <td>
                            <b>Date:</b> '.$date.'<br>
                            <b>Place:</b> '.$place.'
                        </td>
                        <td align="right" style="vertical-align: bottom;">
                            <b>Signature</b><br><br>
                            _____________________
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    </body>
    </html>';

    // --- GENERATE PDF ---
    $options = new Options();
    $options->set('isRemoteEnabled', true);
    $dompdf = new Dompdf($options);
    
    $dompdf->loadHtml($html);
    $dompdf->setPaper('A4', 'portrait');
    $dompdf->render();
    $dompdf->stream("Resume_$name.pdf", ["Attachment" => 0]);
}
?>