import 'package:flutter/material.dart';
import 'package:projectuts/completion_page.dart';

class Quiz extends StatefulWidget {
  const Quiz({super.key});

  @override
  State<Quiz> createState() => _QuizState();
}

class _QuizState extends State<Quiz> {
  int currentQuestionIndex = 0;
  int score = 100; // Skor awal 100

  // List pertanyaan dan jawaban
  List<Map<String, dynamic>> questions = [
    {
      "question": "Apa arti dari 'baru' dalam bahasa Inggris?",
      "options": ["new", "cloudy", "three"],
      "correctAnswer": "new"
    },
    {
      "question": "Apa arti dari 'awan' dalam bahasa Inggris?",
      "options": ["blue", "cloudy", "fast"],
      "correctAnswer": "cloudy"
    },
    {
      "question": "Berapa angka 'tiga' dalam bahasa Inggris?",
      "options": ["two", "three", "five"],
      "correctAnswer": "three"
    }
  ];

  void checkAnswer(String selectedAnswer) {
    setState(() {
      if (selectedAnswer != questions[currentQuestionIndex]["correctAnswer"]) {
        score -= 10; // Kurangi skor jika salah
      }

      if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++; // Pindah ke pertanyaan berikutnya
      } else {
        // Jika semua pertanyaan selesai, pindah ke halaman hasil
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
              builder: (context) => Completion(finalScore: score)),
        );
      }
    });
}

  @override
  Widget build(BuildContext context) {
    double progress = (currentQuestionIndex+1)/questions.length;


    return Scaffold(
      appBar: AppBar(
       leading: IconButton(
          
          icon: Icon(
            Icons.close,
            size: 40,
          ),
          onPressed: () {
            Navigator.pushReplacementNamed(context, '/');
          },
        ),

        title: Row(children: [
            Expanded(
              child: LinearProgressIndicator(
                value: progress,
                color: Colors.green,
                backgroundColor: Colors.grey,
                borderRadius: BorderRadius.circular(40),
                minHeight: 30,
              )
            )
          ],
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            // Pertanyaan
            Text(
              questions[currentQuestionIndex]["question"],
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              textAlign: TextAlign.center,
            ),
            SizedBox(height: 20),

            // Opsi Jawaban menggunakan ListView agar tidak error
            Column(
              children: [
                for (int i = 0; i < questions[currentQuestionIndex]["options"].length; i++)
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 5.0),
                  child: ElevatedButton(
                    onPressed: () => checkAnswer(questions[currentQuestionIndex]["options"][i]),
                    child: Text(questions[currentQuestionIndex]["options"][i]),
                  ),
                )
              ]
            ),

            SizedBox(height: 20),

            // Skor
            Text(
              "Skor: $score",
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
          ],
        ),
      ),
    );
  }
}