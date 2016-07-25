
  var attachName = "myfiles";

  function addInput(){
       createInput(attachName);
    }
  function deleteInput(){
       removeInput();
  }

  function createInput(name){
        var  aElement=document.createElement("input");
        aElement.name=name;
        aElement.type="file";

        var spanElement = document.getElementById("upload");
       /* if(document.getElementById("upload").insertBefore(aElement,spanElement.nextSibling) == null){
            return false;
        }*/
        if(document.getElementById("upload").appendChild(aElement) == null){
            return false;
        }
        return true;
  }

  function removeInput(){
        var aElement = document.getElementById("upload");
        if(aElement.removeChild(aElement.lastChild) == null){
            return false;
        }

        return true;
  }

