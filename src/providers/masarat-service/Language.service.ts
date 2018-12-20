import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs';


@Injectable()
export class LanguageService {
    servicePath_Core: string;

    private _Selectedlang$ = new BehaviorSubject(0);
    public Selectedlang = this._Selectedlang$.asObservable();

    private _Rtl$ = new BehaviorSubject(true);
    public Rtl = this._Rtl$.asObservable();

    private _LanguageOption$ = new BehaviorSubject("eng");
    public LanguageOption = this._LanguageOption$.asObservable();

    public  ElementsTextsContent: LanguageContentResponse[] = [];

    constructor(private _http: Http) {
       
    }

    GetLanguageContent() {
        this._http.get('http://coreapi.umraline.com/api/Languages/GetLanguageContentData').map((response: Response) => response.json()).subscribe((data:LanguageContentResponse[]) => {
            if(data && data.length)
            this.ElementsTextsContent = data;
            localStorage.setItem("ElementsTextsContent_Local", JSON.stringify(this.ElementsTextsContent));
        });
    }
    getData(){
        console.log(this.ElementsTextsContent);
    }
    onChooseLanguage(lang:Language) {
        if (lang==null) {
            this._Selectedlang$.next(parseInt(localStorage.getItem('lang')));
            this._Rtl$.next(parseInt(localStorage.getItem('rtl')) == 1 ? true : false);
            this.LanguagesTypes(parseInt(localStorage.getItem('lang')))
        } else {
            this._Selectedlang$.next(lang.id);
            this._Rtl$.next(lang.rtl);
            this.LanguagesTypes(lang.id)
        }
    }

    DynamicTextContent(key: string) {
        let languageIdm ;
        if(localStorage.getItem('lang')=='ar'){ languageIdm = 2 }else{  languageIdm = 3 }
        var text = '';
        var elementContent = this.ElementsTextsContent.filter(_ => _.contentKey.toLocaleLowerCase() == key.toLocaleLowerCase())[0];
            if (elementContent != null) {
                var textdata = elementContent.contentText.filter(i => i.languageId == languageIdm)[0];
                if (textdata != undefined)
                    text = textdata.text;
            }
        return text;
    }

    LanguagesTypes(data:number){
        let LangOptions:string="eng";
        switch(data){
            case 2:
            LangOptions="ar"
            break;
            default:
            LangOptions="eng"
            break;
        }
        this._LanguageOption$.next(LangOptions);
    }
}

interface LanguageContentResponse {
    contentKey: string,
    contentText: LanguageContentDetailsReponse[]
}

interface LanguageContentDetailsReponse {
    text: string,
    languageId: number
}

export enum LanguageTypeOptions{
	Eng=3,
    Ar=2
}

export interface Language {
    id;
    name;
    rtl;
    isDfault;
}