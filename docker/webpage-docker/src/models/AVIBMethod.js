'use strict'

export class AVIBMethod{
  
  constructor(method,id,calls){
    this.id=id;
    this.name=method.name;
    this.lines=method.lines.low;
    this.cyclomatic=method.cyclomatic.low;
    this.constant=method.constant.low;
    this.icrlmin=method.icrlmin.low;
    this.icrlmax=method.icrlmax.low;
    this.icrlavg=method.icrlavg.low;
    this.icrlsum=method.icrlsum.low;
    this.icflmin=method.icflmin.low;
    this.icflmax=method.icflmax.low;
    this.icflavg=method.icflavg.low;
    this.icflsum=method.icflsum.low;
    this.icrcmin=method.icrcmin.low;
    this.icrcmax=method.icrcmax.low;
    this.icrcavg=method.icrcavg.low;
    this.icrcsum=method.icrcsum.low;
    this.icfcmin=method.icfcmin.low;
    this.icfcmax=method.icfcmax.low;
    this.icfcavg=method.icfcavg.low;
    this.icfcsum=method.icfcsum.low;
    this.icrkmin=method.icrkmin.low;
    this.icrkmax=method.icrkmax.low;
    this.icrkavg=method.icrkavg.low;
    this.icrksum=method.icrksum.low;
    this.icfkmin=method.icfkmin.low;
    this.icfkmax=method.icfkmax.low;
    this.icfkavg=method.icfkavg.low;
    this.icfksum=method.icfksum.low;
    this.ismethod=method.ismethod.low;
    this.iscollapsed=method.iscollapsed.low;
    this.isrecursive=method.isrecursive.low;
    this.calls=calls;
  }

 
}