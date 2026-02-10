<!DOCTYPE html>
<html>
<head>
    <title>Select Resume Template</title>
    <style>
        body { font-family: sans-serif; text-align: center; padding: 50px; }
        .grid { display: flex; justify-content: center; gap: 30px; margin-top: 30px; }
        .card { 
            border: 2px solid #ddd; padding: 20px; width: 200px; cursor: pointer; 
            border-radius: 10px; transition: 0.3s;
        }
        .card:hover { border-color: #007bff; transform: scale(1.05); }
        .card h3 { margin-bottom: 10px; }
        .btn { 
            display: inline-block; padding: 10px 20px; background: #007bff; 
            color: white; text-decoration: none; border-radius: 5px; margin-top: 10px; 
        }
    </style>
</head>
<body>

    <h1>Choose Your Resume Style 🎨</h1>

    <div class="grid">
        <div class="card">
            <h3>Classic Style</h3>
            <p>Simple & Clean</p>
            <a href="resume_form.php?style=classic" class="btn">Select This</a>
        </div>

        <div class="card">
            <h3>Modern Style</h3>
            <p>Blue Header & Bold</p>
            <a href="resume_form.php?style=modern" class="btn">Select This</a>
        </div>
    </div>

</body>
</html>