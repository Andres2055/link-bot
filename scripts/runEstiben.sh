#!/bin/bash

#Constantes que se usarán para arrancar a estiben
process_name="Estiben"
logs_dir="/u01/log/Estiben/"
log_date=$(date +'%d-%B-%Y-%H%M')
estiben_directory="/home/centos/projects/scp/estiben-bot/"
log="${logs_dir}estiben_${log_date}.log"

#Mata el proceso en caso de que ya se esté ejecutando
pkill -f "${process_name}"

#Valida si existe el directorio para los logs
if [[ ! -d "${logs_dir}" ]]
then
    echo "Se creará el directorio ${logs_dir}"
    mkdir -p "${logs_dir}"
fi

cd "${estiben_directory}"
#Instala las dependencias de Node que sean necesarias
npm install

#Ejecuta el servicio en segundo plano y redirige la salida a un archibo de log
nohup bash -c "exec -a $process_name node index.js" > $logs &

echo "Servicio iniciado con el nombre $process_name"
echo "Consulte el Log en: $logs"
