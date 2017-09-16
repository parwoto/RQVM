import { Injectable } from '@angular/core';
import { DEM } from './dem';
import * as THREE from 'three';

@Injectable()
export class DEMLoaderService {
    getFuji(): Promise<DEM> {
        // Creating new DEM data to store data retrieved from BIL file
        let fuji = new DEM();

        var mapPromise = new Promise<DEM>((resolve, reject) => {
            console.log("DEMLoaderService: Empty DEM data of Mt Fuji created on: ", new Date().getTime());

            let content;

            let fileurl: string = "../../../assets/maps/fuji/fuji.bil";

            console.log("1. DEMLoaderService: Beginning loading Mt Fuji data on: ", new Date().getTime())

            this.makeRequest('GET', fileurl)
                .then(function (response: Blob) {
                    var reader = new FileReader();
                    console.log("--------readAsArrayBuffer--------");
                    reader.readAsArrayBuffer(response);
                    reader.onload = () => {
                        let contents = new Uint16Array(reader.result);
                        console.log("3. Result of reading file (on:" + new Date().getTime() + "), length = " + contents.length);
                        fuji.data = contents;
                        fuji.area = "Mountain Fuji";
                        console.log("Data after trasfered to fuji : " + fuji.data.length);
                        console.log("function to acak2 data apakah disini? (1)");
                        resolve(fuji);
                    }
                }, function (Error) {
                    console.log(Error);
                })
                .then(function(){
                    console.log("function to acak2 data apakah disini? (2)");
                });

            console.log("7. DEMLoaderService: Ending again loading Mt Fuji data")

            console.log("8. From demloader:" + fuji.area);
            console.log("9. From demloader:" + fuji.data);
        });

        return mapPromise;
    };


    makeRequest(method, url) {
        return new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest();
            request.open(method, url, true);
            request.responseType = 'blob';
            console.log("2. DEMLoaderService: Beginning loading Mt Fuji data on: ", new Date().getTime())
            request.onload = function () {
                if (request.status === 200) {
                    resolve(request.response);
                } else {
                    reject({
                        status: request.status,
                        statusText: request.statusText
                    });
                }
            };
            request.onerror = function () {
                reject({
                    status: request.status,
                    statusText: request.statusText
                });
            };
            request.send();
        });
    }
};