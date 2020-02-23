#!/bin/bash

logs_dir="/u01/log/Estiben/"
log_date=$(date +'%d-%B-%Y-%H%M')
log="${logs_dir}estiben_${log_date}.log"

#Valida si existe el directorio para los logs
if [[ ! -d "${logs_dir}" ]]
then
    echo "Se creará el directorio ${logs_dir}"
    sudo mkdir -p "${logs_dir}"
    sudo chown centos:centos "${logs_dir}"
fi