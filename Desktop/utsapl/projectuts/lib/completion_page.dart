import 'package:flutter/material.dart';

class Completion extends StatelessWidget {
  final int finalScore; // Properti untuk menyimpan skor akhir

  const Completion({super.key, required this.finalScore}); // Konstruktor yang benar

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Hasil Quiz")), // Menambahkan AppBar
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'Skor Anda: $finalScore', // Menampilkan skor dengan benar
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 20),
            TextButton(
              style: TextButton.styleFrom(
                foregroundColor: Colors.white,
                backgroundColor: Colors.green,
                padding: EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              ),
              onPressed: () {
                Navigator.pushReplacementNamed(context, '/'); // Kembali ke halaman utama
              },
              child: Text('Kembali ke Halaman Utama', style: TextStyle(fontSize: 16)),
            ),
          ],
        ),
      ),
    );
  }
}
