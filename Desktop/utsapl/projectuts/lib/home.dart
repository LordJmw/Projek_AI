import 'package:flutter/material.dart';

class Home extends StatelessWidget {
  const Home({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: TextButton(
          style: TextButton.styleFrom(
            foregroundColor: Colors.black,
            backgroundColor: Colors.blue,
          ),
          onPressed: () {
            Navigator.pushReplacementNamed(context, '/quiz');
          },
          child: const Text('Start Quiz'),
        ),
      ),
    );
  }
}
