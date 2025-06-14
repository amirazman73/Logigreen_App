import jsPDF from 'jspdf';
import 'jspdf-autotable';

const doc = new jsPDF();
doc.text("Testing AutoTable", 14, 10);

doc.autoTable({
  head: [['Name', 'Email']],
  body: [['Alice', 'alice@email.com'], ['Bob', 'bob@email.com']],
});

doc.save('test.pdf');
