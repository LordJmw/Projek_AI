import 'package:flutter/material.dart';

class MyCard extends StatelessWidget {
  const MyCard({super.key});
  static const List<String> test = ["tiga", "ular", "dua", "kelinci"];

  @override
  Widget build(BuildContext context) {
    // Menggunakan MediaQuery untuk mendapatkan ukuran layar
    final screenSize = MediaQuery.of(context).size;
    final isPortrait = screenSize.height > screenSize.width;

    return Padding(
      padding: EdgeInsets.all(screenSize.width * 0.05), // Padding responsif
      child: SingleChildScrollView(
        // Untuk menghindari overflow
        child: Column(
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Icon(
                      Icons.close,
                      size: screenSize.width * 0.05,
                    ), // Ukuran ikon responsif
                    SizedBox(width: screenSize.width * 0.02),
                    Expanded(
                      child: LinearProgressIndicator(
                        minHeight: screenSize.height * 0.025,
                        borderRadius: BorderRadius.circular(20),
                        value: 0.5,
                        backgroundColor: Colors.grey[300],
                        valueColor: const AlwaysStoppedAnimation<Color>(
                          Colors.orange,
                        ),
                      ),
                    ),
                  ],
                ),
                Padding(
                  padding: EdgeInsets.symmetric(
                    vertical: screenSize.height * 0.015,
                  ),
                  child: Text(
                    "Pilih gambar yang benar",
                    style: TextStyle(
                      fontSize:
                          isPortrait
                              ? screenSize.width * 0.08
                              : screenSize.height * 0.06,
                      fontWeight: FontWeight.w900,
                      color: Colors.black,
                      decoration: TextDecoration.none,
                      fontFamily: "Poppins-Medium",
                    ),
                  ),
                ),
                Row(
                  children: [
                    Container(
                      width: screenSize.width * 0.07,
                      height: screenSize.width * 0.07,
                      decoration: BoxDecoration(
                        color: Colors.blue,
                        shape: BoxShape.rectangle,
                        boxShadow: [
                          BoxShadow(
                            color: Colors.blueGrey,
                            blurRadius: 1,
                            spreadRadius: 1,
                            offset: const Offset(0, 2),
                          ),
                        ],
                        borderRadius: BorderRadius.circular(15),
                      ),
                      child: IconButton(
                        icon: Icon(
                          Icons.volume_up,
                          size: screenSize.width * 0.05,
                        ),
                        color: Colors.white,
                        onPressed: () {},
                      ),
                    ),
                    SizedBox(width: screenSize.width * 0.03),
                    Text(
                      "snake",
                      style: TextStyle(
                        fontSize:
                            isPortrait
                                ? screenSize.width * 0.07
                                : screenSize.height * 0.05,
                        fontWeight: FontWeight.normal,
                        color: Colors.black,
                        decoration: TextDecoration.none,
                        fontFamily: "Poppins-Medium",
                      ),
                    ),
                  ],
                ),
              ],
            ),

            Padding(
              padding: EdgeInsets.symmetric(vertical: screenSize.height * 0.02),
              child: GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount:
                      isPortrait ? 2 : 4, // Jumlah kolom menyesuaikan orientasi
                  childAspectRatio:
                      isPortrait ? 2 : 1.5, // Rasio menyesuaikan orientasi
                  mainAxisSpacing: screenSize.height * 0.01,
                  crossAxisSpacing: screenSize.width * 0.02,
                ),
                itemCount: test.length,
                itemBuilder: (context, index) {
                  return Padding(
                    padding: EdgeInsets.all(screenSize.width * 0.01),
                    child: TextButton(
                      style: TextButton.styleFrom(
                        padding: EdgeInsets.all(screenSize.width * 0.02),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                          side: BorderSide(color: Colors.grey, width: 0.5),
                        ),
                      ),
                      onPressed: () {},
                      child: Text(
                        test[index],
                        style: TextStyle(
                          fontSize:
                              isPortrait
                                  ? screenSize.width * 0.045
                                  : screenSize.height * 0.03,
                          color: Colors.black,
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),

            SizedBox(height: screenSize.height * 0.02),
            SizedBox(
              width: double.infinity,
              child: Padding(
                padding: EdgeInsets.symmetric(
                  horizontal: screenSize.width * 0.1,
                ),
                child: TextButton(
                  style: TextButton.styleFrom(
                    padding: EdgeInsets.symmetric(
                      vertical: screenSize.height * 0.02,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                      side: BorderSide(color: Colors.grey, width: 0.5),
                    ),
                  ),
                  onPressed: () {},
                  child: Text(
                    "PERIKSA",
                    style: TextStyle(
                      fontSize:
                          isPortrait
                              ? screenSize.width * 0.05
                              : screenSize.height * 0.035,
                      color: Colors.black,
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}