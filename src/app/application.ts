

export class Application {

  //Variable declartion
  public Key: String = "default";
  public Name: String = "default";
  public Description: String = "default";
  public StartDate: String = "default"; 
  public ShutdownDate: String = "default";
  public ProfessionalOwner: String = "default";
  public TechnicalOwner: String = "default";
  public Sourcing: String = "default";
  public Version: String = "default";
  public COTS: String = "Unknown";
  public Color: String = "lightblue";
  public x: any = -500; //Default X value of location in diagram axis
  public y: any = 0; //Default Y value of location in diagram axis

  public NodeData: Object;
  public NodeDataArray: Object[] = [];

  public Application(ExcelRow: Object) {

  }

  constructor(ExcelRow: Object[][]) {
    var lengthExcelObjects = ExcelRow.length;
    var lengthHeaders = ExcelRow[0].length;

    var KeyPosition = 0;
    var NamePosition = 0;
    
    for (var i = 0; i < lengthHeaders; i++) {
      if (ExcelRow[0][i].toString().includes("id") || ExcelRow[0][i].toString().includes("key")) { //Searches for id or key column of excel file
        KeyPosition = i;
        NamePosition = i;
      } else if (ExcelRow[0][i].toString().includes("Name") || ExcelRow[0][i].toString().includes("name")) { //Searches for name column of excel file
        NamePosition = i;
      } else {
      }
    }

    for (var i = 1; i < lengthExcelObjects + 1; i++) {
      if (ExcelRow[i][1] == null && ExcelRow[i][1] == null) {
        break;
      }
      this.Key = "default"; //Key value (Application) of imported excel file is setted as "default" but will replaced later


      if (ExcelRow[i][KeyPosition] != null) {
        this.Key = ExcelRow[i][KeyPosition].toString(); //Declares key value with key of excel file
      }

      if (ExcelRow[i][NamePosition] != null) {
        this.Name = ExcelRow[i][NamePosition].toString(); //Declares name value with name of excel file
      }
      if (ExcelRow[i][2] != null) {
        this.Description = ExcelRow[i][2].toString(); //Declares description value with description of excel file
      }

      if (ExcelRow[i][3] != null) {
        var today = new Date();
        var StartDate = this.ExcelDateToJSDate(ExcelRow[i][3]);
        var calc = StartDate.toLocaleDateString()
        var newValue = calc.split(".");
        if (parseInt(newValue[0]) < 10) {
          newValue[0] = "0" + newValue[0];
        }
        if (parseInt(newValue[1]) < 10) {
          newValue[1] = "0" + newValue[1];
        }
        this.StartDate = newValue[0] + "." + newValue[1] + "." + newValue[2];

        const str = this.StartDate;
        const words = str.split(".");
        const strShut = this.ShutdownDate;
        const wordsShut = strShut.split(".");
        const strTest = today.toLocaleDateString();
        const Test = strTest.split(".");

        //Adding 0 to the Date if in the Excel File the Date is entered like e.g. 1.7.YYYY than new date would look like 01.07.YYYY
        //To fulfill the requirements for the Editor field
        if (parseInt(Test[0]) < 10) {
          Test[0] = "0" + Test[0];
        }
        if (parseInt(Test[1]) < 10) {
          Test[1] = "0" + Test[1];
        } //Catch Error if Release Date later than Shutdown Date
        const temp = Test[0] + "." + Test[1] + "." + Test[2];
        const wordsTest = temp.split(".");
        if (wordsTest[2] > wordsShut[2] || wordsTest[2] == wordsShut[2] && wordsTest[1] > wordsShut[1]
          || wordsTest[2] == wordsShut[2] && wordsTest[1] == wordsShut[1] && wordsTest[0] > wordsShut[0]) {
          this.Color = "red";
        } else {
          if (wordsTest[2] < words[2] || wordsTest[2] == words[2] && wordsTest[1] < words[1]
            || wordsTest[2] == words[2] && wordsTest[1] == words[1] && wordsTest[0] < words[0]) {
            this.Color = "yellow";
          } else {
            this.Color = "lightblue";
          }
        }
      }

      if (ExcelRow[i][4] != null) {
        var today = new Date();
        var ShutDate = this.ExcelDateToJSDate(ExcelRow[i][4]);
        var calc = ShutDate.toLocaleDateString()
        var newValue = calc.split(".");
        if (parseInt(newValue[0]) < 10) {
          newValue[0] = "0" + newValue[0];
        }
        if (parseInt(newValue[1]) < 10) {
          newValue[1] = "0" + newValue[1];
        }
        this.ShutdownDate = newValue[0] + "." + newValue[1] + "." + newValue[2];

        const str = this.StartDate;
        const words = str.split(".");
        const strShut = this.ShutdownDate;
        const wordsShut = strShut.split(".");
        const strTest = today.toLocaleDateString();
        const Test = strTest.split(".");

        //Adding 0 to the Date if in the Excel File the Date is entered like e.g. 1.7.YYYY than new date would look like 01.07.YYYY
        //To fulfill the requirements for the Editor field
        if (parseInt(Test[0]) < 10) {
          Test[0] = "0" + Test[0];
        }
        if (parseInt(Test[1]) < 10) {
          Test[1] = "0" + Test[1];
        }//Catch Error if Release Date later than Shutdown Date
        const temp = Test[0] + "." + Test[1] + "." + Test[2];
        const wordsTest = temp.split(".");
        if (wordsTest[2] > wordsShut[2] || wordsTest[2] == wordsShut[2] && wordsTest[1] > wordsShut[1]
          || wordsTest[2] == wordsShut[2] && wordsTest[1] == wordsShut[1] && wordsTest[0] > wordsShut[0]) {
          this.Color = "red";
        } else {
          if (wordsTest[2] < words[2] || wordsTest[2] == words[2] && wordsTest[1] < words[1]
            || wordsTest[2] == words[2] && wordsTest[1] == words[1] && wordsTest[0] < words[0]) {
            this.Color = "yellow";
          } else {
            this.Color = "lightblue";
          }
        }
      }
//Creates json with defined/assigned values
      this.NodeData = {
        key: this.Key, name: this.Name, desc: this.Description, releaseDate: this.StartDate, shutdownDate: this.ShutdownDate, version: this.Version, cots: this.COTS, color: this.Color, loc: (this.x.toString() + " " + this.y.toString())
      };
      this.NodeDataArray.push(this.NodeData); //Adds json of application to application array
      this.x = this.x + 200; //After added application location is changing. 5 Applications next to each other, after 5 applications it continues in new row
      if (this.x >= 500) {
        this.x = -500;
        this.y = this.y + 75;
      }
    }
  }

//Method for converting excel date into useable date
  public ExcelDateToJSDate(serial) {
    var utc_days = Math.floor(serial - 25569);
    var utc_value = utc_days * 86400;
    var date_info = new Date(utc_value * 1000);

    var fractional_day = serial - Math.floor(serial) + 0.0000001;

    return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate());
  }
}
