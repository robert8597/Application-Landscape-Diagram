import { Variable } from "@angular/compiler/src/render3/r3_ast";

export class Application {

    public Key: String ="default";
    public Name: String = "default";
    public Description: String = "default";
    public StartDate: String = "default"; //Change to Date
    public ShutdownDate: String = "default";
    public ProfessionalOwner: String = "default";
    public TechnicalOwner: String = "default";
    public Sourcing: String = "default";
    public Version: String = "default";
    public COTS: String = "Unknown";
    public Color:String = "lightblue";
   
    public NodeData:Object;
    public NodeDataArray: Object[] = [ ];

    public Application(ExcelRow:Object){
        
    }

    constructor(ExcelRow:Object[][]) {
        var lengthExcelObjects = ExcelRow.length;
        var lengthHeaders = ExcelRow[0].length;

        var KeyPosition = 0;
        var NamePosition = 0;
        console.log("KEYplatz="+ExcelRow[0][0].toString());
        for(var i=0;i<lengthHeaders;i++){
            if(ExcelRow[0][i].toString().includes("id")||ExcelRow[0][i].toString().includes("key")){
            KeyPosition = i;
            NamePosition = i;
            } else if(ExcelRow[0][i].toString().includes("Name")||ExcelRow[0][i].toString().includes("name")){
                NamePosition = i;
            } else {
               // NamePosition = KeyPosition;
            }
            }

for(var i=1;i<lengthExcelObjects+1;i++){
    if(ExcelRow[i][1]==null&&ExcelRow[i][1]==null){
        break;
    }
    this.Key = "default";
    

    if(ExcelRow[i][KeyPosition]!=null){
    this.Key = ExcelRow[i][KeyPosition].toString();
}

if(ExcelRow[i][NamePosition]!=null){
    this.Name = ExcelRow[i][NamePosition].toString();
}
if(ExcelRow[i][2]!=null){
    this.Description = ExcelRow[i][2].toString();
}

if(ExcelRow[i][3]!=null){
    var StartDate =  this.ExcelDateToJSDate(ExcelRow[i][3]);
    var calc = StartDate.toLocaleDateString()
    var Test = calc.split(".");
    if(parseInt(Test[0]) < 10)
    {
        Test[0] = "0" + Test[0];
    }
    if(parseInt(Test[1]) < 10)
    {
        Test[1] = "0" + Test[1];
    }
    this.StartDate = Test[0] + "." +Test[1] + "." + Test[2];
}

if(ExcelRow[i][4]!=null){
    var ShutDate = this.ExcelDateToJSDate(ExcelRow[i][4]);
    var calc = ShutDate.toLocaleDateString()
    var Test = calc.split(".");
    if(parseInt(Test[0]) < 10)
    {
        Test[0] = "0" + Test[0];
    }
    if(parseInt(Test[1]) < 10)
    {
        Test[1] = "0" + Test[1];
    }
    this.ShutdownDate = Test[0] + "." +Test[1] + "." + Test[2];
}

    this.NodeData = {
    key: this.Key, name: this.Name, desc: this.Description, releaseDate: this.StartDate, shutdownDate: this.ShutdownDate, version: this.Version, cots: this.COTS, color: this.Color
    };
    this.NodeDataArray.push(this.NodeData);
    
}

        console.log("Anzahl="+lengthExcelObjects);
        
      }


      public ExcelDateToJSDate(serial) {
        var utc_days  = Math.floor(serial - 25569);
        var utc_value = utc_days * 86400;                                        
        var date_info = new Date(utc_value * 1000);
     
        var fractional_day = serial - Math.floor(serial) + 0.0000001;
     
        // var total_seconds = Math.floor(86400 * fractional_day);
     
        // var seconds = total_seconds % 60;
     
        // total_seconds -= seconds;
     
        // var hours = Math.floor(total_seconds / (60 * 60));
        // var minutes = Math.floor(total_seconds / 60) % 60;
     
        //  return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
         return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate());
     }


}
