#!/bin/bash

#Constantes que se usarán para arrancar a estiben
logs_dir="/u01/log/Estiben/"
estiben_directory="/home/centos/projects/scp/estiben-bot/"
log="${logs_dir}Estiben.log"
process_name="Estiben"

#pkill -f "${process_name}"

#Valida si existe el directorio para los logs
if [[ ! -d "${logs_dir}" ]]
then
    echo "Se creará el directorio ${logs_dir}"
    sudo mkdir -p "${logs_dir}"
    sudo chown centos:centos "${logs_dir}"
fi

> "${log}"

cd "${estiben_directory}"
#Instala las dependencias de Node que sean necesarias
npm install

#Ejecuta el servicio en segundo plano y redirige la salida a un archibo de log
nohup bash -c "exec -a ${process_name} node ${estiben_directory}index.js" > "${log}" 2> /dev/null &

echo "Servicio iniciado con el nombre ${process_name}"
echo "Consulte el Log en: ${log}"