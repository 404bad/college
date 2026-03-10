<html>
<head>
<title>JSP Calculator</title>
</head>

<body>

<h1>Simple JSP Calculator</h1>

<form method="post">

Enter First Number:
<input type="number" name="num1"><br><br>

Enter Second Number:
<input type="number" name="num2"><br><br>

Select Operation:
<select name="op">
<option value="add">Addition</option>
<option value="sub">Subtraction</option>
<option value="mul">Multiplication</option>
<option value="div">Division</option>
</select>

<br><br>

<input type="submit" value="Calculate">

</form>

<%

String s1 = request.getParameter("num1");
String s2 = request.getParameter("num2");
String op = request.getParameter("op");

if(s1 != null && s2 != null && op != null)
{
    try {

        int a = Integer.parseInt(s1);
        int b = Integer.parseInt(s2);
        int result = 0;

        if(op.equals("add"))
            result = a + b;

        else if(op.equals("sub"))
            result = a - b;

        else if(op.equals("mul"))
            result = a * b;

        else if(op.equals("div"))
            result = a / b;

%>

<h2>Result: <%= result %></h2>

<%

    } catch(Exception e) {

        out.println("<h3 style='color:red;'>Invalid Input!</h3>");

    }
}

%>

</body>
</html>